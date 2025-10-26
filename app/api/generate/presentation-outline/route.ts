export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { generatePresentationOutline } from '@/lib/gemini';
import { validateSlideCount, SUBSCRIPTION_LIMITS } from '@/lib/subscription-utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, pageCount = 5, userId } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    // Validate slide count against user's subscription limits
    const validation = await validateSlideCount(pageCount, userId);

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: `Slide limit exceeded. ${validation.isPremium ? 'Premium' : 'Free'} users can create up to ${validation.maxAllowed} slides.`,
          maxAllowed: validation.maxAllowed,
          isPremium: validation.isPremium,
          upgradeRequired: !validation.isPremium,
        },
        { status: 403 },
      );
    }

    // Cap the slide count to user's limit (safety check)
    const cappedPageCount = Math.min(pageCount, validation.maxAllowed);

    const outlines = await generatePresentationOutline({
      prompt,
      pageCount: cappedPageCount,
    });

    return NextResponse.json({
      outlines,
      maxSlides: validation.maxAllowed,
      isPremium: validation.isPremium,
    });
  } catch (error) {
    console.error('Error generating presentation outline:', error);
    return NextResponse.json({ error: 'Failed to generate presentation outline' }, { status: 500 });
  }
}
