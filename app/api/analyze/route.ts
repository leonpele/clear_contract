import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface AnalysisRequest {
  text: string;
}

interface AnalysisResponse {
  summary: string;
  risky_clauses: Array<{ quote: string; explanation: string }>;
  favorable_clauses: Array<{ quote: string; explanation: string }>;
  key_numbers: Array<{ label: string; value: string }>;
}

const SYSTEM_PROMPT = `You are a legal document expert. Analyze the contract provided and return a JSON object with this exact structure:
{
  "summary": "3-sentence plain language summary of what this contract is about",
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
      max_tokens: 1500,
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

    // Extract text from response
    const responseText = message.choices[0]?.message.content || '';

    // Parse JSON response
    let analysis: AnalysisResponse;
    try {
      analysis = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Anthropic response:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse analysis response' },
        { status: 500 }
      );
    }

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
