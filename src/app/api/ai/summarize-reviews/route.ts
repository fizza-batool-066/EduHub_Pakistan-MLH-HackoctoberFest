import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, withErrorHandler } from "@/lib/api-utils";
import { callLLM, extractJSON } from "@/lib/ai";

/**
 * POST /api/ai/summarize-reviews
 * Body: { academyId }
 * Public — anyone can view a review summary
 * Returns: pros, cons, verdict, sentiment breakdown
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { academyId } = body;
  if (!academyId) return apiSuccess({ error: "academyId is required" });

  const academy = await db.academy.findUnique({
    where: { id: academyId },
    include: { reviews: { orderBy: { date: "desc" }, take: 30 } },
  });
  if (!academy) return apiSuccess({ error: "Academy not found" });

  if (academy.reviews.length === 0) {
    return apiSuccess({
      summary: {
        pros: ["No reviews yet — be the first to review!"],
        cons: [],
        verdict: "Insufficient data to summarize. Check back after more students share their experiences.",
        sentiment: { positive: 0, neutral: 0, negative: 0 },
        totalCount: 0,
      },
    });
  }

  // Deterministic fallback
  const positiveReviews = academy.reviews.filter(r => r.rating >= 4);
  const negativeReviews = academy.reviews.filter(r => r.rating <= 2);
  const neutralReviews = academy.reviews.filter(r => r.rating === 3);
  const total = academy.reviews.length;

  let summary: any = {
    pros: [
      `${positiveReviews.length} of ${total} students rated 4★ or higher`,
      `Average rating: ${academy.rating}/5`,
      positiveReviews[0]?.comment.slice(0, 80) + "..." || "Generally positive feedback",
    ],
    cons: negativeReviews.length > 0 ? [
      `${negativeReviews.length} students had concerns`,
      negativeReviews[0]?.comment.slice(0, 80) + "..." || "Some areas for improvement noted",
    ] : ["No major concerns reported"],
    verdict: `${academy.name} has an overall rating of ${academy.rating}/5 from ${total} reviews. ${positiveReviews.length > negativeReviews.length ? "Most students have positive experiences." : "Mixed reviews — consider visiting in person."}`,
    sentiment: {
      positive: Math.round((positiveReviews.length / total) * 100),
      neutral: Math.round((neutralReviews.length / total) * 100),
      negative: Math.round((negativeReviews.length / total) * 100),
    },
    totalCount: total,
  };

  // LLM enrichment
  try {
    const reviewsForLLM = academy.reviews.map((r) => ({
      rating: r.rating,
      comment: r.comment.slice(0, 200),
      studentName: r.studentName,
    }));

    const systemPrompt = `You are an AI that summarizes student reviews for academies in Pakistan. Return ONLY valid JSON (no markdown). Be balanced, honest, and specific. Mention real points from the reviews.`;

    const userPrompt = `Academy: ${academy.name} (rating: ${academy.rating}/5, ${total} reviews)

Reviews:
${JSON.stringify(reviewsForLLM, null, 2)}

Return JSON with this exact shape:
{
  "pros": ["3-4 specific positive points extracted from reviews"],
  "cons": ["2-3 specific negative points or areas for improvement"],
  "verdict": "2-3 sentence balanced verdict",
  "sentiment": { "positive": number, "neutral": number, "negative": number }
}`;

    const llmResponse = await callLLM(systemPrompt, userPrompt, { temperature: 0.4, maxTokens: 1000 });
    const parsed = extractJSON<any>(llmResponse);
    if (parsed && Array.isArray(parsed.pros) && Array.isArray(parsed.cons)) {
      summary = {
        ...parsed,
        totalCount: total,
      };
    }
  } catch (e: any) {
    console.warn("[AI/summarize] LLM failed, using deterministic data:", e?.message);
  }

  return apiSuccess({ summary });
});
