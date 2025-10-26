import { NextResponse } from 'next/server';
import { generateOpenRouterCompletion } from '@/lib/openrouter';

export const maxDuration = 30;

interface EnhancePromptRequest {
  prompt: string;
  type: 'icon' | 'presentation' | 'resume' | 'general';
}

export async function POST(request: Request) {
  try {
    console.log('[Enhance Prompt] Starting request...');

    const body: EnhancePromptRequest = await request.json();
    const { prompt, type = 'general' } = body;

    console.log('[Enhance Prompt] Received:', { prompt, type });

    if (!prompt || prompt.trim().length === 0) {
      console.log('[Enhance Prompt] Error: Empty prompt');
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Create enhancement instructions based on type
    const typeInstructions = {
      icon: 'Enhance this icon description to be more specific about visual elements, style, colors, shapes, and mood. Keep it concise but detailed.',
      presentation:
        'Enhance this presentation topic to be more structured and clear about the key points, audience, and objectives.',
      resume:
        'Enhance this resume description to be more professional, achievement-focused, and impactful.',
      general: 'Enhance this description to be more clear, specific, and detailed.',
    };

    const systemPrompt = `You are a prompt enhancement assistant. Your job is to take a basic user prompt and enhance it to be more detailed, specific, and effective for AI generation. ${typeInstructions[type]}

Rules:
- Keep the core idea intact
- Add relevant details that improve clarity
- Make it more descriptive and specific
- Keep it under 200 words
- Return ONLY the enhanced prompt, no explanations or meta-commentary`;

    console.log('[Enhance Prompt] Calling OpenRouter...');

    // Combine system and user prompts for free models that don't support system prompts
    const combinedPrompt = `${systemPrompt}\n\nOriginal prompt: "${prompt}"\n\nEnhance this prompt:`;

    const enhancedPrompt = await generateOpenRouterCompletion({
      messages: [
        {
          role: 'user',
          content: combinedPrompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 300,
      // Use Llama 3.3 for prompt enhancement
      model: 'meta-llama/llama-3.3-70b-instruct:free',
    });

    console.log('[Enhance Prompt] Received response:', enhancedPrompt?.substring(0, 100));

    if (!enhancedPrompt || !enhancedPrompt.trim()) {
      throw new Error('No enhanced prompt received from AI');
    }

    // Clean up the response - remove quotes and extra whitespace
    let cleanedPrompt = enhancedPrompt.trim();

    // Remove surrounding quotes if present
    if (
      (cleanedPrompt.startsWith('"') && cleanedPrompt.endsWith('"')) ||
      (cleanedPrompt.startsWith("'") && cleanedPrompt.endsWith("'"))
    ) {
      cleanedPrompt = cleanedPrompt.slice(1, -1);
    }

    // Remove any "Enhanced prompt:" or similar prefixes
    cleanedPrompt = cleanedPrompt.replace(
      /^(Enhanced prompt:|Enhanced:|Here's the enhanced prompt:)\s*/i,
      '',
    );

    cleanedPrompt = cleanedPrompt.trim();

    console.log('[Enhance Prompt] Success!');

    return NextResponse.json({
      success: true,
      enhancedPrompt: cleanedPrompt,
      originalPrompt: prompt,
    });
  } catch (error) {
    console.error('[Enhance Prompt] Error details:', error);
    console.error(
      '[Enhance Prompt] Error stack:',
      error instanceof Error ? error.stack : 'No stack',
    );
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to enhance prompt',
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 },
    );
  }
}
