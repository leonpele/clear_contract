import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import { MAX_CONTRACT_CHARS, MAX_PDF_BYTES } from '@/lib/limits';

export async function POST(request: NextRequest) {
  try {
    // Open to visitors without an account: extracting text is cheap, and the
    // analysis itself is what gets gated (see /api/analyze).
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Please upload a PDF file' },
        { status: 400 }
      );
    }

    if (file.size > MAX_PDF_BYTES) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const data = await pdfParse(buffer);
    const extractedText = data.text.slice(0, MAX_CONTRACT_CHARS);

    return NextResponse.json({
      text: extractedText,
      pages: data.numpages,
    });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to extract text from PDF' },
      { status: 500 }
    );
  }
}
