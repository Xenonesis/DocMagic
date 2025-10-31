/**
 * Translation API Route
 * Handles translation requests for documents
 */

import { NextRequest, NextResponse } from 'next/server';
import { translationService } from '@/lib/translation-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, targetLanguage, sourceLanguage, preserveFormatting, context } = body;

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required parameters: text and targetLanguage' },
        { status: 400 }
      );
    }

    const result = await translationService.translateText(text, {
      targetLanguage,
      sourceLanguage,
      preserveFormatting,
      context,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Translation failed' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
