import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, withErrorHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { callLLM, extractJSON } from "@/lib/ai";

/**
 * POST /api/ai/career
 * Body: { careerGoal, currentLevel?, interests? }
 * Returns: skills, learning roadmap, best academies, career opportunities
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireRole("student", "academy", "teacher", "admin");
  const body = await req.json();
  const { careerGoal, currentLevel, interests } = body;

  if (!careerGoal) {
    return apiSuccess({ error: "Career goal is required" });
  }

  // Find relevant academies based on career goal keywords
  const goalLower = careerGoal.toLowerCase();
  const keywords: string[] = [];
  if (/software|developer|engineer|programmer|web|app/i.test(goalLower)) {
    keywords.push("software", "web", "development", "programming", "computer");
  }
  if (/data|ai|ml|machine learning|scientist/i.test(goalLower)) {
    keywords.push("data", "ai", "machine learning", "analytics");
  }
  if (/network|ccna|cisco/i.test(goalLower)) {
    keywords.push("network", "ccna", "cisco");
  }
  if (/security|cyber|hack/i.test(goalLower)) {
    keywords.push("security", "hacking", "cyber");
  }
  if (/medical|doctor|mdcat/i.test(goalLower)) {
    keywords.push("mdcat", "medical", "biology");
  }
  if (/account|finance|acca/i.test(goalLower)) {
    keywords.push("acca", "account", "finance");
  }
  if (/marketing|digital|seo|amazon/i.test(goalLower)) {
    keywords.push("marketing", "digital", "amazon", "seo");
  }

  // Get academies matching any keyword
  const allAcademies = await db.academy.findMany({
    where: { status: "active", verified: true },
    orderBy: { rating: "desc" },
    take: 20,
  });
  const matchedAcademies = allAcademies.filter((a) => {
    const text = (a.coursesListJson + " " + a.description + " " + a.category).toLowerCase();
    return keywords.some((k) => text.includes(k));
  }).slice(0, 5);

  let result: any = {
    careerGoal,
    skills: [
      "Core technical skills",
      "Problem-solving ability",
      "Communication skills",
      "Industry-specific tools",
    ],
    roadmap: [
      { phase: "Foundation (0-3 months)", description: "Build core fundamentals and basic concepts" },
      { phase: "Skill Building (3-6 months)", description: "Master technical skills through hands-on practice" },
      { phase: "Practical Projects (6-9 months)", description: "Build portfolio projects and gain real experience" },
      { phase: "Job Search (9-12 months)", description: "Apply for jobs, prepare interviews, network" },
    ],
    academies: matchedAcademies.map((a) => ({ id: a.id, name: a.name, rating: a.rating, feeRange: a.feeRange })),
    opportunities: [
      { role: `Junior ${careerGoal}`, salaryRange: "Rs 40K - 80K/month", growth: "High" },
      { role: `Mid-level ${careerGoal}`, salaryRange: "Rs 80K - 180K/month", growth: "Very High" },
      { role: `Senior ${careerGoal}`, salaryRange: "Rs 180K - 400K/month", growth: "Excellent" },
    ],
    outlook: `The ${careerGoal} field in Pakistan is growing rapidly with strong demand in major cities. Salaries have increased 25% year-over-year, with international remote opportunities expanding the market significantly.`,
  };

  try {
    const academiesForLLM = matchedAcademies.map((a) => ({
      name: a.name, rating: a.rating, feeRange: a.feeRange, city: a.city,
      courses: JSON.parse(a.coursesListJson),
    }));

    const systemPrompt = `You are an expert AI career counselor for Pakistani students. Return ONLY valid JSON (no markdown fences). Be specific, actionable, and locally relevant (mention Pakistani cities, salaries in PKR, local job market).`;

    const userPrompt = `Career goal: ${careerGoal}
Current level: ${currentLevel || "Not specified"}
Interests: ${interests || "Not specified"}

Available academies in Pakistan:
${JSON.stringify(academiesForLLM, null, 2)}

Return JSON with this exact shape:
{
  "careerGoal": "${careerGoal}",
  "skills": ["4-6 specific skills needed"],
  "roadmap": [{"phase": "Phase name (duration)", "description": "What to do"}],
  "academies": [{"id": "academyId from list above", "name": "academy name", "rating": rating, "feeRange": "fee range", "whyRecommended": "1-line reason"}],
  "opportunities": [{"role": "specific role title", "salaryRange": "Rs X-Y/month", "growth": "High|Very High|Excellent"}],
  "outlook": "2-3 sentence outlook for this career in Pakistan"
}`;

    const llmResponse = await callLLM(systemPrompt, userPrompt, { temperature: 0.7, maxTokens: 1500 });
    const parsed = extractJSON<any>(llmResponse);
    if (parsed && parsed.skills && Array.isArray(parsed.skills)) {
      result = parsed;
    }
  } catch (e: any) {
    console.warn("[AI/career] LLM failed, using deterministic data:", e?.message);
  }

  // Save to history
  await db.aIRecommendation.create({
    data: {
      userId: user.id,
      type: "career",
      inputsJson: JSON.stringify({ careerGoal, currentLevel, interests }),
      outputsJson: JSON.stringify(result),
    },
  });

  return apiSuccess({ result });
});
