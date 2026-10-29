import ZAI from "z-ai-web-dev-sdk";

/**
 * Call the GLM LLM via z-ai-web-dev-sdk.
 * Server-side only.
 */
export async function callLLM(
  systemPrompt: string,
  userPrompt: string,
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      thinking: { type: "disabled" },
      temperature: options.temperature ?? 0.7,
      // @ts-ignore max_tokens is supported
      max_tokens: options.maxTokens ?? 1500,
    });
    const content = completion.choices[0]?.message?.content;
    return content || "";
  } catch (e: any) {
    console.error("[LLM] call failed:", e?.message);
    throw new Error(`AI service unavailable: ${e?.message || "unknown error"}`);
  }
}

/**
 * Try to parse JSON from an LLM response.
 * Strips code fences and finds the first { or [ ... } block.
 */
export function extractJSON<T = any>(text: string): T | null {
  if (!text) return null;
  // Strip code fences
  const cleaned = text.replace(/```json\s*/g, "").replace(/```/g, "");
  try {
    return JSON.parse(cleaned);
  } catch {}
  // Find first { ... } or [ ... ]
  const objMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objMatch) {
    try { return JSON.parse(objMatch[0]); } catch {}
  }
  const arrMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrMatch) {
    try { return JSON.parse(arrMatch[0]); } catch {}
  }
  return null;
}
