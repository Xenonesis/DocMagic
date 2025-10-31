/**
 * Personalization API Route
 * Handles content personalization requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { personalizationService } from '@/lib/personalization-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, preferences, documentType, context, action } = body;

    if (!content || !documentType) {
      return NextResponse.json(
        { error: 'Missing required parameters: content and documentType' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'personalize':
        result = await personalizationService.personalizeContent(content, {
          preferences: preferences || {},
          documentType,
          context,
          preserveStructure: true,
        });
        break;

      case 'suggestions':
        result = await personalizationService.generateSuggestions(content, {
          preferences: preferences || {},
          documentType,
          context,
        });
        break;

      case 'adaptTone':
        result = await personalizationService.adaptToneAndStyle(content, preferences || {});
        break;

      case 'optimizeIndustry':
        if (!preferences?.industry) {
          return NextResponse.json(
            { error: 'Industry is required for optimization' },
            { status: 400 }
          );
        }
        result = await personalizationService.optimizeForIndustry(
          content,
          preferences.industry,
          preferences.role
        );
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: personalize, suggestions, adaptTone, or optimizeIndustry' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Personalization API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Personalization failed' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
