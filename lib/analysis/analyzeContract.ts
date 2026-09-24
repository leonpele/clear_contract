import OpenAI from 'openai';
import type { AnalysisResult } from '@/lib/analysisTypes';
import { normalizeAnalysisResponse } from '@/lib/normalizeAnalysisResponse';

export class AnalysisConfigError extends Error {}
export class AnalysisParseError extends Error {}

const SYSTEM_PROMPT = `You are a legal document expert. Analyze the contract provided and return a JSON object with this exact structure:
{
  "summary": "3-sentence plain language summary of what this contract is about",
  "risk_score": {
    "percentage": 0,
    "level": "low",
    "explanation": "2-4 sentences: why this score was assigned, referencing concrete themes from the contract"
  },
  "risky_clauses": [
    {
      "quote": "exact problematic clause from the contract — copy verbatim so it can be found in the text",
      "explanation": "plain language explanation of why this is risky",
      "severity": "high"
    }
  ],
  "favorable_clauses": [
    {
      "quote": "exact favorable clause from the contract",
      "explanation": "plain language explanation of why this is good"
    }
  ],
  "key_numbers": [
    {
      "label": "what this number represents",
      "value": "the number, date, or duration"
    }
  ]
}

RISK SCORING (risk_score):
- "percentage" is an integer from 0 (safest) to 100 (highest risk) for the contract as a whole.
- "level" MUST be exactly one of: "low", "medium", "high", aligned with percentage: low = 0-33, medium = 34-66, high = 67-100.
- Weight the score especially when you find issues related to: automatic renewal; termination penalties or harsh exit terms; exclusivity or non-compete; broad liability limitations or waivers; unclear or one-sided payment terms; IP ownership transfer or broad IP assignment beyond what is typical.
- The explanation must briefly cite which of these themes (if any) drove the score, without inventing clauses not in the text.

RISKY CLAUSE SEVERITY:
- For each risky_clauses item, set "severity" to "high" (serious legal/financial exposure) or "warning" (worth reviewing but less severe).
- Use "high" for automatic renewal, harsh termination, broad liability waivers, IP assignment, exclusivity.
- Use "warning" for moderately unfavorable but negotiable terms.

QUOTES: Every "quote" must be copied exactly from the contract (same wording) so it can be highlighted in the original text.

Return ONLY the JSON object, no markdown, no preamble.`;

/** Runs the OpenAI contract analysis. Shared by the member and guest flows. */
export async function analyzeContract(text: string): Promise<AnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim()) {
    throw new AnalysisConfigError(
      'OPENAI_API_KEY is not configured. Add it to .env.local and restart the dev server.'
    );
  }

  const openai = new OpenAI({ apiKey });
  const message = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    max_tokens: 2200,
    temperature: 0,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: text },
    ],
  });

  const responseText = message.choices[0]?.message.content || '';

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(responseText) as Record<string, unknown>;
  } catch {
    console.error('Failed to parse OpenAI response:', responseText);
    throw new AnalysisParseError('Failed to parse analysis response');
  }

  return normalizeAnalysisResponse(parsed);
}
