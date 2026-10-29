import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, withErrorHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { callLLM, extractJSON } from "@/lib/ai";

/**
 * POST /api/ai/compare
 * Body: { academyIds: string[], studentContext?: { careerGoal?, budget? } }
 * Returns: AI analysis of which academy is best for the student
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireRole("student", "academy", "teacher", "admin");
  const body = await req.json();
  const { academyIds, studentContext } = body;

  if (!Array.isArray(academyIds) || academyIds.length < 2) {
    return apiSuccess({ error: "Please provide at least 2 academies to compare" });
  }

  const academies = await db.academy.findMany({
    where: { id: { in: academyIds } },
    include: {
      courses: true,
      reviews: { take: 5, orderBy: { date: "desc" } },
      _count: { select: { reviews: true } },
    },
  });

  if (academies.length < 2) {
    return apiSuccess({ error: "Could not find the selected academies" });
  }

  // Deterministic scoring
  const scored = academies.map((a) => {
    let score = 50;
    if (a.rating >= 4.7) score += 15;
    else if (a.rating >= 4.5) score += 10;
    else if (a.rating >= 4.0) score += 5;
    if (a.verified) score += 8;
    if (a.totalStudents > 1000) score += 5;
    if (a._count.reviews > 500) score += 5;
    if (a.distance <= 3) score += 5;
    return { academy: a, score: Math.min(100, score) };
  }).sort((a, b) => b.score - a.score);

  const bestPick = scored[0];

  // LLM analysis
  let aiAnalysis: any = {
    summary: `${bestPick.academy.name} emerges as the top choice based on its ${bestPick.academy.rating}★ rating, ${bestPick.academy.totalStudents}+ students, and verified status.`,
    bestPick: {
      academyId: bestPick.academy.id,
      academyName: bestPick.academy.name,
      reasons: [
        `Highest overall score: ${bestPick.score}/100`,
        `Strong ${bestPick.academy.rating}★ rating from ${bestPick.academy.reviewsCount} reviews`,
        `${bestPick.academy.totalStudents}+ active students`,
        bestPick.academy.verified ? "Verified academy status" : "Strong reputation",
      ],
    },
    comparisons: scored.map((s, i) => ({
      academyId: s.academy.id,
      academyName: s.academy.name,
      strengths: i === 0 ? ["Best overall match", "Highest student satisfaction", "Strong course catalog"] : ["Good option", "Worth considering"],
      weaknesses: i === 0 ? ["Premium pricing"] : ["Lower rating than top pick", "Fewer reviews"],
    })),
    recommendation: `Based on your${studentContext?.careerGoal ? ` goal of becoming a ${studentContext.careerGoal}` : ""} needs, we recommend ${bestPick.academy.name}. It offers the best combination of quality, reputation, and value.`,
  };

  try {
    const academiesForLLM = scored.map((s) => ({
      id: s.academy.id,
      name: s.academy.name,
      rating: s.academy.rating,
      reviewsCount: s.academy.reviewsCount,
      feeRange: s.academy.feeRange,
      city: s.academy.city,
      distance: s.academy.distance,
      totalStudents: s.academy.totalStudents,
      totalTeachers: s.academy.totalTeachers,
      verified: s.academy.verified,
      courses: JSON.parse(s.academy.coursesListJson),
      facilities: JSON.parse(s.academy.facilitiesJson),
      sampleReviews: s.academy.reviews.map(r => ({ rating: r.rating, comment: r.comment.slice(0, 100) })),
    }));

    const systemPrompt = `You are an expert AI education advisor comparing academies for a Pakistani student. Return ONLY valid JSON (no markdown fences, no extra text). Be objective, specific, and helpful.`;

    const userPrompt = `Student context: ${JSON.stringify(studentContext || {})}

Academies to compare:
${JSON.stringify(academiesForLLM, null, 2)}

Return JSON with this exact shape:
{
  "summary": "2-3 sentence overall analysis",
  "bestPick": { "academyId": "string", "academyName": "string", "reasons": ["string", "string", "string"] },
  "comparisons": [{ "academyId": "string", "academyName": "string", "strengths": ["string"], "weaknesses": ["string"] }],
  "recommendation": "1-2 sentence personalized recommendation"
}`;

    const llmResponse = await callLLM(systemPrompt, userPrompt, { temperature: 0.5, maxTokens: 1200 });
    const parsed = extractJSON<any>(llmResponse);
    if (parsed && parsed.bestPick && Array.isArray(parsed.comparisons)) {
      aiAnalysis = parsed;
    }
  } catch (e: any) {
    console.warn("[AI/compare] LLM analysis failed, using deterministic data:", e?.message);
  }

  // Save to history
  await db.aIRecommendation.create({
    data: {
      userId: user.id,
      type: "compare",
      inputsJson: JSON.stringify({ academyIds, studentContext }),
      outputsJson: JSON.stringify(aiAnalysis),
    },
  });

  return apiSuccess({ analysis: aiAnalysis, academies });
});
