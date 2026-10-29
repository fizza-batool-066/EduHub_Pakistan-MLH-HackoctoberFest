import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, withErrorHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { callLLM, extractJSON } from "@/lib/ai";

/**
 * POST /api/ai/recommend
 * Body: { city, budget, course, careerGoal, timings, distance }
 * Returns: ranked academy recommendations with explanations
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireRole("student", "academy", "teacher", "admin");
  const body = await req.json();
  const { city, budget, course, careerGoal, timings, distance } = body;

  // Step 1: Get all candidate academies matching basic filters
  const where: any = { status: "active" };
  if (city) where.city = city;
  if (budget) where.minFee = { lte: budget };
  if (distance) where.distance = { lte: distance };

  const candidates = await db.academy.findMany({
    where,
    take: 20,
    orderBy: { rating: "desc" },
    include: { courses: true, reviews: { take: 3, orderBy: { date: "desc" } } },
  });

  if (candidates.length === 0) {
    return apiSuccess({ recommendations: [] });
  }

  // Step 2: Compute deterministic match scores
  const scored = candidates.map((a) => {
    let score = 70;
    if (a.minFee <= (budget || 999999)) score += 10;
    if (course && a.coursesListJson.toLowerCase().includes(course.toLowerCase())) score += 12;
    if (a.rating >= 4.5) score += 5;
    if (a.verified) score += 3;
    if (a.distance <= (distance || 10)) score += 5;
    score = Math.min(98, score);
    return { academy: a, score };
  }).sort((a, b) => b.score - a.score).slice(0, 6);

  // Step 3: Build base recommendations (deterministic fallback)
  let enrichedRecs = scored.map(({ academy: a, score }) => ({
    academy: a,
    matchScore: score,
    reasons: [
      a.rating >= 4.5 ? "Excellent rating from students" : "Good student reviews",
      a.minFee <= (budget || 999999) ? "Within your budget" : "Premium option",
      a.distance <= (distance || 10) ? "Close to your location" : `${a.distance}km from you`,
      a.verified ? "Verified academy with quality standards" : "Up and coming academy",
    ].slice(0, 3),
    predictedOutcome: careerGoal ?
      `Strong foundation for ${careerGoal} career` :
      "Excellent foundation for your career path",
    salaryRange: course && /software|web|mobile|data|ai/i.test(course) ?
      "Rs 80K - 250K/month" : "Rs 50K - 150K/month",
    growthRate: "+18% annually",
  }));

  // Step 4: Try LLM for richer personalized explanations
  try {
    const academiesForLLM = scored.slice(0, 6).map((s) => ({
      id: s.academy.id,
      name: s.academy.name,
      rating: s.academy.rating,
      feeRange: s.academy.feeRange,
      city: s.academy.city,
      courses: JSON.parse(s.academy.coursesListJson),
      distance: s.academy.distance,
    }));

    const systemPrompt = `You are an AI education advisor for Pakistani students. The student is looking for academy recommendations. Analyze their preferences and the candidate academies, then return ONLY a JSON array (no other text, no code fences). Each item must have: academyId (string), reasons (array of 3 short strings, max 80 chars each), predictedOutcome (string, max 100 chars), salaryRange (string), growthRate (string). Be specific and personalized based on the student's career goal.`;

    const userPrompt = `Student preferences:
- City: ${city || "Any"}
- Budget: Rs ${budget?.toLocaleString() || "Any"}
- Course interest: ${course || "Any"}
- Career goal: ${careerGoal || "Not specified"}
- Preferred timings: ${timings || "Any"}
- Max distance: ${distance || "Any"} km

Candidate academies (top-rated, sorted by match):
${JSON.stringify(academiesForLLM, null, 2)}

Return a JSON array with personalized recommendations. Each entry must have academyId matching one of the candidates above. Example:
[{"academyId":"abc","reasons":["reason1","reason2","reason3"],"predictedOutcome":"...","salaryRange":"Rs X-Y/month","growthRate":"+Z%"}]`;

    const llmResponse = await callLLM(systemPrompt, userPrompt, { temperature: 0.6, maxTokens: 1500 });
    const parsed = extractJSON<any[]>(llmResponse);
    if (Array.isArray(parsed) && parsed.length > 0) {
      enrichedRecs = enrichedRecs.map((rec) => {
        const llmMatch = parsed.find((p: any) => p.academyId === rec.academy.id);
        if (llmMatch) {
          return {
            ...rec,
            reasons: Array.isArray(llmMatch.reasons) && llmMatch.reasons.length > 0 ? llmMatch.reasons : rec.reasons,
            predictedOutcome: llmMatch.predictedOutcome || rec.predictedOutcome,
            salaryRange: llmMatch.salaryRange || rec.salaryRange,
            growthRate: llmMatch.growthRate || rec.growthRate,
          };
        }
        return rec;
      });
    }
  } catch (e: any) {
    console.warn("[AI/recommend] LLM enrichment failed, using deterministic data:", e?.message);
  }

  // Save to AI history
  await db.aIRecommendation.create({
    data: {
      userId: user.id,
      type: "recommend",
      inputsJson: JSON.stringify({ city, budget, course, careerGoal, timings, distance }),
      outputsJson: JSON.stringify(enrichedRecs.map(r => ({ academyId: (r.academy as any).id, matchScore: r.matchScore }))),
    },
  });

  return apiSuccess({ recommendations: enrichedRecs });
});
