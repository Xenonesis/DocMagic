/**
 * Pollinations.ai API Integration
 * Provides image generation using Pollinations.ai free API
 * Documentation: https://github.com/pollinations/pollinations
 */

const POLLINATIONS_IMAGE_API = 'https://image.pollinations.ai/prompt';

export interface PollinationsIconOptions {
  prompt: string;
  style: string;
  size: number;
  colorScheme: string;
  seed?: number;
  model?: 'flux' | 'flux-realism' | 'flux-anime' | 'flux-3d' | 'turbo';
  nologo?: boolean;
  enhance?: boolean;
}

/**
 * Generate icon URL using Pollinations.ai
 * The API generates images directly from URL parameters
 */
export function generatePollinationsIconUrl({
  prompt,
  style,
  size,
  colorScheme,
  seed,
  model = 'flux',
  nologo = true,
  enhance = true,
}: PollinationsIconOptions): string {
  // Build enhanced prompt based on parameters
  const styleDescriptions: Record<string, string> = {
    flat: "flat design, modern minimalist 2D, clean geometric shapes, solid colors",
    "3d": "3D rendered, realistic lighting, soft shadows, depth and dimension",
    gradient: "smooth gradient fills, vibrant color transitions, modern gradient style",
    line: "clean line art, outline style, minimal details, vector line drawing",
    sketch: "hand-drawn sketch, organic pencil strokes, artistic and loose",
    minimalist: "ultra-minimalist, absolute simplicity, essential elements only",
    cartoon: "playful cartoon style, rounded shapes, bold outlines, fun and approachable",
    isometric: "isometric 3D perspective, 30-degree angles, technical illustration",
  };

  const colorDescriptions: Record<string, string> = {
    vibrant: "vibrant bold colors, high saturation, eye-catching",
    pastel: "soft pastel colors, gentle calming tones, low saturation",
    monochrome: "monochrome design, single color with shades",
    warm: "warm colors, reds oranges yellows, inviting and energetic",
    cool: "cool colors, blues greens purples, calming and professional",
  };

  const styleDesc = styleDescriptions[style] || "modern clean design";
  const colorDesc = colorScheme.startsWith("#")
    ? `${colorScheme} color scheme`
    : colorDescriptions[colorScheme] || "balanced color palette";

  // Create enhanced prompt for better results
  const enhancedPrompt = `${prompt}, ${styleDesc}, ${colorDesc}, icon design, professional, centered composition, clean background, high quality, detailed`;

  // Encode prompt for URL
  const encodedPrompt = encodeURIComponent(enhancedPrompt);

  // Build URL with parameters
  const params = new URLSearchParams({
    width: size.toString(),
    height: size.toString(),
    model: model,
    nologo: nologo.toString(),
    enhance: enhance.toString(),
  });

  // Add seed if provided for reproducibility
  if (seed !== undefined) {
    params.append('seed', seed.toString());
  }

  return `${POLLINATIONS_IMAGE_API}/${encodedPrompt}?${params.toString()}`;
}

/**
 * Generate multiple icon variations using Pollinations.ai
 * Creates variations by using different seeds
 */
export async function generatePollinationsIcons({
  prompt,
  style,
  size,
  colorScheme,
  count = 4,
  model = 'flux',
}: Omit<PollinationsIconOptions, 'seed'> & { count?: number }): Promise<string[]> {
  const icons: string[] = [];
  
  // Generate multiple variations with different seeds
  for (let i = 0; i < count; i++) {
    const seed = Math.floor(Math.random() * 1000000);
    const iconUrl = generatePollinationsIconUrl({
      prompt,
      style,
      size,
      colorScheme,
      seed,
      model,
      nologo: true,
      enhance: true,
    });
    icons.push(iconUrl);
  }

  return icons;
}

/**
 * Get model recommendation based on style
 */
export function getRecommendedModel(style: string): PollinationsIconOptions['model'] {
  const modelMap: Record<string, PollinationsIconOptions['model']> = {
    '3d': 'flux-3d',
    'cartoon': 'flux-anime',
    'sketch': 'flux',
    'flat': 'flux',
    'gradient': 'flux',
    'line': 'flux',
    'minimalist': 'flux',
    'isometric': 'flux-3d',
  };

  return modelMap[style] || 'flux';
}

/**
 * Validate and fetch icon from Pollinations.ai
 * Ensures the generated image is valid
 */
export async function validatePollinationsIcon(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return response.ok && (contentType?.startsWith('image/') ?? false);
  } catch (error) {
    console.error('Error validating Pollinations icon:', error);
    return false;
  }
}

/**
 * Generate icons with automatic model selection
 */
export async function generatePollinationsIconsAuto(options: Omit<PollinationsIconOptions, 'seed' | 'model' | 'nologo' | 'enhance'> & { count?: number }): Promise<string[]> {
  const recommendedModel = getRecommendedModel(options.style);
  return generatePollinationsIcons({
    ...options,
    model: recommendedModel,
  });
}
