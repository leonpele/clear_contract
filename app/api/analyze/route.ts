import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { AnalysisResult } from '@/lib/analysisTypes';
import { normalizeAnalysisResponse } from '@/lib/normalizeAnalysisResponse';

interface AnalysisRequest {
  text: string;
}

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
      "quote": "exact problematic clause from the contract",
      "explanation": "plain language explanation of why this is risky"
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

Return ONLY the JSON object, no markdown, no preamble.`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey?.trim()) {
      return NextResponse.json(
        {
          error:
            'OPENAI_API_KEY is not configured. Add it to .env.local and restart the dev server.',
        },
        { status: 503 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const body = (await request.json()) as AnalysisRequest;
    const { text } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Contract text is required' },
        { status: 400 }
      );
    }

    if (text.length > 50000) {
      return NextResponse.json(
        { error: 'Contract text exceeds 50,000 characters' },
        { status: 400 }
      );
    }

    const message = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      max_tokens: 2200,
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: text,
        },
      ],
    });

    const responseText = message.choices[0]?.message.content || '';

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(responseText) as Record<string, unknown>;
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse analysis response' },
        { status: 500 }
      );
    }

    const analysis: AnalysisResult = normalizeAnalysisResponse(parsed);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in /api/analyze:', error);

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
