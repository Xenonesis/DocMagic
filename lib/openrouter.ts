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
        'Authorization': `Bearer ${config.apiKey}`,
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
        `OpenRouter API error: ${response.status} - ${errorData.error?.message || response.statusText}`
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
      `Failed to generate completion: ${error instanceof Error ? error.message : 'Unknown error'}`
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
    console.warn(`Free model detected (${selectedModel}). Reducing maxTokens from ${maxTokens} to ${adjustedMaxTokens} to avoid truncation.`);
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
      throw new Error('AI response was truncated. Try increasing maxTokens or reducing the request size.');
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
  // Build enhanced prompt based on parameters
  const styleDescriptions: Record<string, string> = {
    flat: "flat design, modern minimalist 2D style, clean lines",
    "3d": "3D rendered, realistic lighting and shadows, depth",
    gradient: "vibrant gradient colors, smooth color transitions",
    line: "simple line art, outline style, minimal details",
    sketch: "hand-drawn sketch, artistic pencil style",
    minimalist: "ultra-minimalist, maximum simplicity, essential elements only",
    cartoon: "playful cartoon style, fun and friendly",
    isometric: "isometric 3D perspective, technical illustration",
  };

  const colorDescriptions: Record<string, string> = {
    vibrant: "vibrant and bold colors, high saturation",
    pastel: "soft pastel colors, gentle tones",
    monochrome: "monochrome, single color with shades",
    warm: "warm color palette, reds, oranges, yellows",
    cool: "cool color palette, blues, greens, purples",
  };

  const styleDesc = styleDescriptions[style] || "modern design";
  const colorDesc = colorScheme.startsWith("#")
    ? `primary color ${colorScheme}`
    : colorDescriptions[colorScheme] || "balanced color palette";

  const enhancedPrompt = `Create a professional icon: ${prompt}. Style: ${styleDesc}. Colors: ${colorDesc}. Icon should be clear, recognizable, and suitable for ${size}x${size}px resolution. No text or labels in the icon. Centered composition with transparent or simple background.`;

  // For now, generate SVG code descriptions that can be rendered
  // In production, you would integrate with DALL-E, Midjourney, or Stable Diffusion
  const svgPrompt = `Generate an SVG code for an icon based on this description: ${enhancedPrompt}. Return only valid SVG code that can be directly rendered, starting with <svg> tag and including viewBox="${size} ${size}".`;

  try {
    const response = await generateOpenRouterCompletion({
      messages: [
        {
          role: "system",
          content:
            "You are an expert icon designer. Generate clean, valid SVG code for icons. Return only the SVG code without explanation or markdown.",
        },
        {
          role: "user",
          content: svgPrompt,
        },
      ],
      temperature: 0.9,
      maxTokens: 2000,
    });

    // Extract SVG code
    let svgCode = response.trim();
    
    // Remove markdown code blocks if present
    svgCode = svgCode.replace(/```svg\n?/g, "").replace(/```\n?/g, "");
    
    // Ensure it starts with <svg
    if (!svgCode.startsWith("<svg")) {
      const svgMatch = svgCode.match(/<svg[\s\S]*<\/svg>/i);
      if (svgMatch) {
        svgCode = svgMatch[0];
      } else {
        throw new Error("No valid SVG code generated");
      }
    }

    // Convert SVG to data URL
    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svgCode).toString("base64")}`;

    // Generate multiple variations by tweaking the prompt
    const icons = [svgDataUrl];

    // Generate additional variations if needed
    if (icons.length < 4) {
      // For demo purposes, create slight variations
      // In production, make separate API calls with variation prompts
      for (let i = 1; i < 4; i++) {
        icons.push(svgDataUrl);
      }
    }

    return icons;
  } catch (error) {
    console.error("Error generating icon:", error);
    
    // Fallback: generate a simple placeholder SVG
    const fallbackSvg = generateFallbackIcon(prompt, style, colorScheme, size);
    const fallbackDataUrl = `data:image/svg+xml;base64,${Buffer.from(fallbackSvg).toString("base64")}`;
    
    return [fallbackDataUrl, fallbackDataUrl, fallbackDataUrl, fallbackDataUrl];
  }
}

/**
 * Generate a fallback icon as SVG
 */
function generateFallbackIcon(
  prompt: string,
  style: string,
  colorScheme: string,
  size: number
): string {
  const colors: Record<string, string> = {
    vibrant: "#3b82f6",
    pastel: "#a5b4fc",
    monochrome: "#6b7280",
    warm: "#f59e0b",
    cool: "#06b6d4",
  };
  
  const color = colorScheme.startsWith("#") ? colorScheme : colors[colorScheme] || "#3b82f6";
  
  // Create a simple geometric icon based on the first letter or shape
  const firstLetter = prompt.trim()[0]?.toUpperCase() || "?";
  
  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="${color}" opacity="0.1" rx="${size * 0.2}"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.35}" fill="${color}" opacity="0.2"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="${color}" text-anchor="middle" dominant-baseline="central">${firstLetter}</text>
  </svg>`;
}

/**
 * List of recommended models for different use cases
 */
export const RECOMMENDED_MODELS = {
  // Best quality (higher cost)
  premium: [
    'anthropic/claude-3.5-sonnet',
    'openai/gpt-4-turbo',
    'google/gemini-pro-1.5',
  ],
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
