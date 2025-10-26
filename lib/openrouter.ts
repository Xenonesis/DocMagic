/**
 * OpenRouter API Integration
 * Provides unified interface for multiple AI models through OpenRouter
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Get OpenRouter configuration from environment variables
 */
export function getOpenRouterConfig() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';
  const provider = process.env.AI_PROVIDER || 'openrouter';

  return {
    apiKey,
    model,
    provider,
    isEnabled: provider === 'openrouter' && !!apiKey,
  };
}

/**
 * Validate OpenRouter API connection
 */
export async function validateOpenRouterConnection(): Promise<boolean> {
  const config = getOpenRouterConfig();

  if (!config.isEnabled) {
    return false;
  }

  try {
    await generateOpenRouterCompletion({
      messages: [{ role: 'user', content: 'test' }],
      maxTokens: 10,
    });
    return true;
  } catch (error) {
    console.error('OpenRouter connection validation failed:', error);
    return false;
  }
}

/**
 * Generate completion using OpenRouter API
 */
export async function generateOpenRouterCompletion({
  messages,
  temperature = 0.7,
  maxTokens = 8000,
  model,
}: {
  messages: OpenRouterMessage[];
  temperature?: number;
  maxTokens?: number;
  model?: string;
}): Promise<string> {
  const config = getOpenRouterConfig();

  if (!config.apiKey) {
    throw new Error('OPENROUTER_API_KEY environment variable is not set');
  }

  const selectedModel = model || config.model;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': process.env.NEXT_PUBLIC_APP_NAME || 'DocMagic',
      },
      body: JSON.stringify({
        model: selectedModel,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenRouter API error: ${response.status} - ${errorData.error?.message || response.statusText}`,
      );
    }

    const data: OpenRouterResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response generated from OpenRouter');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw new Error(
      `Failed to generate completion: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Extract JSON from markdown code blocks
 */
export function extractJsonFromMarkdown(text: string): string {
  const jsonMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  return jsonMatch ? jsonMatch[1].trim() : text.trim();
}

/**
 * Generate structured JSON response using OpenRouter
 */
export async function generateStructuredResponse<T = any>({
  systemPrompt,
  userPrompt,
  temperature = 0.7,
  maxTokens = 8000,
  model,
}: {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
}): Promise<T> {
  const config = getOpenRouterConfig();
  const selectedModel = model || config.model;

  // Some free models (like gemma-3n-e2b-it) don't support system prompts
  // Combine system and user prompts for compatibility
  const isFreeModel = selectedModel.includes('free') || selectedModel.includes('gemma-3n');

  // Free models often have lower token limits (2000-4000 tokens)
  // Adjust maxTokens accordingly to avoid truncation
  const adjustedMaxTokens = isFreeModel ? Math.min(maxTokens, 4000) : maxTokens;

  if (isFreeModel && maxTokens > 4000) {
    console.warn(
      `Free model detected (${selectedModel}). Reducing maxTokens from ${maxTokens} to ${adjustedMaxTokens} to avoid truncation.`,
    );
  }

  const messages: OpenRouterMessage[] = isFreeModel
    ? [{ role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }]
    : [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ];

  const response = await generateOpenRouterCompletion({
    messages,
    temperature,
    maxTokens: adjustedMaxTokens,
    model: selectedModel,
  });

  // Extract JSON from markdown if present
  const jsonText = extractJsonFromMarkdown(response);

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Failed to parse JSON response:', jsonText);
    console.error('Response length:', response.length, 'characters');
    console.error('JSON text length:', jsonText.length, 'characters');

    // Check if response was likely truncated
    if (!jsonText.trim().endsWith('}') && !jsonText.trim().endsWith(']')) {
      throw new Error(
        'AI response was truncated. Try increasing maxTokens or reducing the request size.',
      );
    }

    throw new Error('Failed to parse AI response as JSON');
  }
}

/**
 * Generate icon using OpenRouter with image generation models
 */
export async function generateIconWithOpenRouter({
  prompt,
  style,
  size,
  colorScheme,
}: {
  prompt: string;
  style: string;
  size: number;
  colorScheme: string;
}): Promise<string[]> {
  // Build enhanced prompt based on parameters with better descriptions
  const styleDescriptions: Record<string, string> = {
    flat: 'flat design with solid colors, modern minimalist 2D style, clean geometric shapes, no gradients or shadows',
    '3d': '3D rendered with realistic lighting, soft shadows, depth and dimension, smooth surfaces, professional 3D modeling style',
    gradient:
      'smooth gradient fills, vibrant color transitions, modern gradient mesh style, depth through color',
    line: 'clean line art, outline only style, consistent stroke width, minimal internal details, vector line drawing',
    sketch:
      'hand-drawn sketch style, organic pencil strokes, artistic and loose, sketch-like texture, natural imperfections',
    minimalist:
      'ultra-minimalist design, absolute simplicity, single shape focus, essential elements only, maximum negative space',
    cartoon:
      'playful cartoon style, rounded friendly shapes, bold outlines, fun and approachable, animation-ready design',
    isometric:
      'isometric 3D perspective, 30-degree angles, technical illustration style, precise geometric forms, professional diagram quality',
  };

  const colorDescriptions: Record<string, string> = {
    vibrant:
      'vibrant and bold colors with high saturation, eye-catching, energetic color palette, RGB primaries',
    pastel:
      'soft pastel colors, gentle and calming tones, low saturation, light and airy feel, muted palette',
    monochrome:
      'single color monochrome design, various shades and tints of one hue, elegant simplicity',
    warm: 'warm color palette with reds, oranges, and yellows, inviting and energetic, sunset-inspired tones',
    cool: 'cool color palette with blues, greens, and purples, calming and professional, ocean-inspired tones',
  };

  const styleDesc = styleDescriptions[style] || 'modern clean design';
  const colorDesc = colorScheme.startsWith('#')
    ? `use ${colorScheme} as the primary color with complementary shades and tints`
    : colorDescriptions[colorScheme] || 'balanced professional color palette';

  // Create a more detailed and structured prompt for better results
  const enhancedPrompt = `Design a professional icon with these specifications:

SUBJECT: ${prompt}
STYLE: ${styleDesc}
COLORS: ${colorDesc}
SIZE: ${size}x${size}px optimized
COMPOSITION: Centered, balanced, clear focal point
BACKGROUND: Transparent or subtle simple background
QUALITY: Production-ready, scalable vector graphics
CONSTRAINTS: No text, no labels, no watermarks, icon must be instantly recognizable

Create clean, professional SVG code with proper viewBox="${size} ${size}". Use semantic shapes and maintain visual clarity at all sizes.`;

  // Improved SVG generation prompt with clearer instructions
  const svgPrompt = `Generate SVG code for this icon specification:

${enhancedPrompt}

IMPORTANT REQUIREMENTS:
1. Start with: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
2. Use semantic SVG elements (rect, circle, path, polygon, etc.)
3. Apply the specified style and colors accurately
4. Keep code clean and well-structured
5. End with: </svg>
6. Return ONLY the SVG code, no explanations or markdown

Generate the complete, valid SVG code now:`;

  try {
    const response = await generateOpenRouterCompletion({
      messages: [
        {
          role: 'system',
          content: `You are an expert SVG icon designer and code generator. You create professional, production-ready icon designs in valid SVG code.

YOUR EXPERTISE:
- Creating clean, semantic SVG markup
- Understanding visual design principles
- Applying color theory effectively
- Generating scalable vector graphics
- Following design style guidelines precisely

YOUR OUTPUT:
- Always return ONLY valid SVG code
- Never include explanations, comments, or markdown
- Start with <svg> tag and end with </svg>
- Use proper viewBox and dimensions
- Create visually appealing, professional icons`,
        },
        {
          role: 'user',
          content: svgPrompt,
        },
      ],
      temperature: 0.8, // Slightly lower for more consistent quality
      maxTokens: 3000, // More tokens for complex icons
    });

    // Extract and clean SVG code
    let svgCode = response.trim();

    // Remove markdown code blocks if present
    svgCode = svgCode
      .replace(/```svg\n?/g, '')
      .replace(/```xml\n?/g, '')
      .replace(/```\n?/g, '');

    // Remove any explanatory text before or after SVG
    const svgMatch = svgCode.match(/<svg[\s\S]*?<\/svg>/i);
    if (svgMatch) {
      svgCode = svgMatch[0];
    } else if (!svgCode.startsWith('<svg')) {
      throw new Error('No valid SVG code generated');
    }

    // Validate basic SVG structure
    if (!svgCode.includes('</svg>')) {
      throw new Error('Invalid SVG: missing closing tag');
    }

    // Convert SVG to data URL
    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svgCode).toString('base64')}`;

    // Generate variations with different prompts for variety
    const icons = [svgDataUrl];

    // Generate 3 more variations with slight modifications
    for (let i = 1; i < 4; i++) {
      try {
        const variationPrompt = `Create a VARIATION ${i} of this icon (make it slightly different while keeping the same concept):

${enhancedPrompt}

VARIATION INSTRUCTIONS:
- Keep the same subject and overall concept
- Adjust the composition or perspective slightly
- Vary shape details or proportions
- Maintain the same style and color scheme
- Return ONLY valid SVG code starting with <svg> and ending with </svg>`;

        const variationResponse = await generateOpenRouterCompletion({
          messages: [
            {
              role: 'system',
              content:
                'You are an expert SVG icon designer. Generate clean, valid SVG code variations. Return only the SVG code without explanation.',
            },
            {
              role: 'user',
              content: variationPrompt,
            },
          ],
          temperature: 0.85 + i * 0.05, // Increase temperature for more variation
          maxTokens: 3000,
        });

        let varSvgCode = variationResponse.trim();
        varSvgCode = varSvgCode
          .replace(/```svg\n?/g, '')
          .replace(/```xml\n?/g, '')
          .replace(/```\n?/g, '');

        const varSvgMatch = varSvgCode.match(/<svg[\s\S]*?<\/svg>/i);
        if (varSvgMatch) {
          varSvgCode = varSvgMatch[0];
          const varDataUrl = `data:image/svg+xml;base64,${Buffer.from(varSvgCode).toString('base64')}`;
          icons.push(varDataUrl);
        } else {
          // If variation fails, use the original with slight modification
          icons.push(svgDataUrl);
        }
      } catch (varError) {
        console.warn(`Variation ${i} generation failed, using original:`, varError);
        icons.push(svgDataUrl);
      }
    }

    return icons;
  } catch (error) {
    console.error('Error generating icon:', error);

    // Fallback: generate a simple but professional placeholder SVG
    const fallbackSvg = generateFallbackIcon(prompt, style, colorScheme, size);
    const fallbackDataUrl = `data:image/svg+xml;base64,${Buffer.from(fallbackSvg).toString('base64')}`;

    return [fallbackDataUrl, fallbackDataUrl, fallbackDataUrl, fallbackDataUrl];
  }
}

/**
 * Generate a professional fallback icon as SVG
 */
function generateFallbackIcon(
  prompt: string,
  style: string,
  colorScheme: string,
  size: number,
): string {
  const colors: Record<string, string> = {
    vibrant: '#3b82f6',
    pastel: '#a5b4fc',
    monochrome: '#6b7280',
    warm: '#f59e0b',
    cool: '#06b6d4',
  };

  const color = colorScheme.startsWith('#') ? colorScheme : colors[colorScheme] || '#3b82f6';

  // Determine icon type from prompt keywords
  const lowerPrompt = prompt.toLowerCase();

  // Create different fallback designs based on common icon types
  if (lowerPrompt.includes('rocket') || lowerPrompt.includes('launch')) {
    return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.6" />
        </linearGradient>
      </defs>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.45}" fill="${color}" opacity="0.1"/>
      <path d="M ${size * 0.5} ${size * 0.2} L ${size * 0.35} ${size * 0.5} L ${size * 0.5} ${size * 0.45} L ${size * 0.65} ${size * 0.5} Z" fill="url(#grad1)"/>
      <circle cx="${size * 0.5}" cy="${size * 0.7}" r="${size * 0.08}" fill="${color}" opacity="0.8"/>
      <circle cx="${size * 0.4}" cy="${size * 0.75}" r="${size * 0.05}" fill="${color}" opacity="0.6"/>
      <circle cx="${size * 0.6}" cy="${size * 0.75}" r="${size * 0.05}" fill="${color}" opacity="0.6"/>
    </svg>`;
  }

  if (
    lowerPrompt.includes('heart') ||
    lowerPrompt.includes('love') ||
    lowerPrompt.includes('like')
  ) {
    return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <path d="M ${size * 0.5} ${size * 0.75} C ${size * 0.25} ${size * 0.55}, ${size * 0.2} ${size * 0.35}, ${size * 0.3} ${size * 0.25} C ${size * 0.4} ${size * 0.15}, ${size * 0.5} ${size * 0.2}, ${size * 0.5} ${size * 0.3} C ${size * 0.5} ${size * 0.2}, ${size * 0.6} ${size * 0.15}, ${size * 0.7} ${size * 0.25} C ${size * 0.8} ${size * 0.35}, ${size * 0.75} ${size * 0.55}, ${size * 0.5} ${size * 0.75} Z" fill="${color}" opacity="0.9"/>
      <circle cx="${size * 0.4}" cy="${size * 0.35}" r="${size * 0.05}" fill="white" opacity="0.5"/>
    </svg>`;
  }

  if (lowerPrompt.includes('star') || lowerPrompt.includes('favorite')) {
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.4;
    return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <path d="M ${cx} ${cy - r} L ${cx + r * 0.3} ${cy + r * 0.3} L ${cx + r} ${cy + r * 0.3} L ${cx + r * 0.4} ${cy + r * 0.7} L ${cx + r * 0.5} ${cy + r * 1.2} L ${cx} ${cy + r * 0.9} L ${cx - r * 0.5} ${cy + r * 1.2} L ${cx - r * 0.4} ${cy + r * 0.7} L ${cx - r} ${cy + r * 0.3} L ${cx - r * 0.3} ${cy + r * 0.3} Z" fill="${color}" opacity="0.9"/>
    </svg>`;
  }

  if (
    lowerPrompt.includes('check') ||
    lowerPrompt.includes('success') ||
    lowerPrompt.includes('complete')
  ) {
    return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.4}" fill="${color}" opacity="0.2"/>
      <path d="M ${size * 0.3} ${size * 0.5} L ${size * 0.45} ${size * 0.65} L ${size * 0.7} ${size * 0.35}" stroke="${color}" stroke-width="${size * 0.08}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  if (
    lowerPrompt.includes('settings') ||
    lowerPrompt.includes('gear') ||
    lowerPrompt.includes('config')
  ) {
    return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.15}" fill="${color}" opacity="0.9"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.35}" fill="none" stroke="${color}" stroke-width="${size * 0.06}" opacity="0.7"/>
      <circle cx="${size / 2}" cy="${size * 0.2}" r="${size * 0.06}" fill="${color}"/>
      <circle cx="${size / 2}" cy="${size * 0.8}" r="${size * 0.06}" fill="${color}"/>
      <circle cx="${size * 0.2}" cy="${size / 2}" r="${size * 0.06}" fill="${color}"/>
      <circle cx="${size * 0.8}" cy="${size / 2}" r="${size * 0.06}" fill="${color}"/>
    </svg>`;
  }

  if (
    lowerPrompt.includes('user') ||
    lowerPrompt.includes('person') ||
    lowerPrompt.includes('profile')
  ) {
    return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size / 2}" cy="${size * 0.35}" r="${size * 0.15}" fill="${color}" opacity="0.9"/>
      <path d="M ${size * 0.25} ${size * 0.8} Q ${size * 0.25} ${size * 0.55}, ${size * 0.5} ${size * 0.55} Q ${size * 0.75} ${size * 0.55}, ${size * 0.75} ${size * 0.8} Z" fill="${color}" opacity="0.9"/>
    </svg>`;
  }

  if (lowerPrompt.includes('search') || lowerPrompt.includes('find')) {
    return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size * 0.4}" cy="${size * 0.4}" r="${size * 0.2}" fill="none" stroke="${color}" stroke-width="${size * 0.06}"/>
      <line x1="${size * 0.55}" y1="${size * 0.55}" x2="${size * 0.75}" y2="${size * 0.75}" stroke="${color}" stroke-width="${size * 0.08}" stroke-linecap="round"/>
    </svg>`;
  }

  // Default: Create a professional geometric icon based on first letter
  const firstLetter = prompt.trim()[0]?.toUpperCase() || '?';

  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:0.15" />
        <stop offset="100%" style="stop-color:${color};stop-opacity:0.05" />
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" fill="url(#bgGrad)" rx="${size * 0.2}"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.35}" fill="${color}" opacity="0.15"/>
    <text x="50%" y="50%" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${size * 0.4}" font-weight="600" fill="${color}" text-anchor="middle" dominant-baseline="central">${firstLetter}</text>
  </svg>`;
}

/**
 * List of recommended models for different use cases
 */
export const RECOMMENDED_MODELS = {
  // Best quality (higher cost)
  premium: ['anthropic/claude-3.5-sonnet', 'openai/gpt-4-turbo', 'google/gemini-pro-1.5'],
  // Balanced quality and cost
  balanced: [
    'anthropic/claude-3-haiku',
    'openai/gpt-3.5-turbo',
    'meta-llama/llama-3.1-70b-instruct',
  ],
  // Cost-effective (lower cost)
  economical: [
    'openai/gpt-3.5-turbo',
    'meta-llama/llama-3.1-8b-instruct',
    'google/gemini-flash-1.5',
  ],
} as const;
