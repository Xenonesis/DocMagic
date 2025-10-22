/**
 * Unified AI Service
 * Supports both OpenRouter and Gemini APIs with automatic fallback
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getOpenRouterConfig,
  generateStructuredResponse as generateOpenRouterStructured,
  extractJsonFromMarkdown,
} from "./openrouter";

// Get AI provider configuration
function getAIConfig() {
  const provider = process.env.AI_PROVIDER || 'openrouter';
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  
  return {
    provider,
    useOpenRouter: provider === 'openrouter' && !!openRouterKey,
    useGemini: provider === 'gemini' && !!geminiKey,
    openRouterKey,
    geminiKey,
  };
}

// Lazy-loaded Gemini instance
let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    const config = getAIConfig();
    if (!config.geminiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set.");
    }
    try {
      genAI = new GoogleGenerativeAI(config.geminiKey);
    } catch (error) {
      console.error("Failed to initialize Google Generative AI:", error);
      throw new Error("Failed to initialize Google Generative AI.");
    }
  }
  return genAI;
}

/**
 * Generate structured JSON response using the configured AI provider
 */
export async function generateAIResponse<T = any>({
  systemPrompt,
  userPrompt,
  temperature = 0.7,
  maxTokens = 4000,
}: {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<T> {
  const config = getAIConfig();

  // Try OpenRouter first if configured
  if (config.useOpenRouter) {
    try {
      return await generateOpenRouterStructured<T>({
        systemPrompt,
        userPrompt,
        temperature,
        maxTokens,
      });
    } catch (error) {
      console.error('OpenRouter failed, attempting fallback to Gemini:', error);
      
      // If Gemini is available, fall back to it
      if (config.geminiKey) {
        console.log('Falling back to Gemini API...');
      } else {
        throw error;
      }
    }
  }

  // Use Gemini (either as primary or fallback)
  if (config.useGemini || config.geminiKey) {
    try {
      const model = getGenAI().getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const jsonText = extractJsonFromMarkdown(response.text());
      
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  throw new Error('No AI provider configured. Please set either OPENROUTER_API_KEY or GEMINI_API_KEY.');
}

/**
 * Validate AI API connection
 */
export async function validateAIConnection(): Promise<boolean> {
  const config = getAIConfig();

  // Skip validation during build time
  if (process.env.NODE_ENV === 'production' && !process.env.RUNTIME_ENV) {
    return true;
  }

  try {
    if (config.useOpenRouter) {
      await generateAIResponse({
        systemPrompt: 'You are a test assistant.',
        userPrompt: 'Respond with: {"status": "ok"}',
        maxTokens: 50,
      });
      return true;
    }

    if (config.useGemini) {
      const model = getGenAI().getGenerativeModel({ model: "gemini-2.0-flash" });
      await model.generateContent("test");
      return true;
    }

    return false;
  } catch (error) {
    console.error("AI Connection Test Failed:", error);
    if (process.env.NODE_ENV === 'production' && !process.env.RUNTIME_ENV) {
      return true;
    }
    throw new Error("Unable to connect to AI API.");
  }
}

/**
 * Get current AI provider information
 */
export function getAIProviderInfo() {
  const config = getAIConfig();
  const openRouterConfig = getOpenRouterConfig();
  
  return {
    provider: config.provider,
    isOpenRouter: config.useOpenRouter,
    isGemini: config.useGemini,
    model: config.useOpenRouter ? openRouterConfig.model : 'gemini-2.0-flash',
    hasApiKey: !!(config.openRouterKey || config.geminiKey),
  };
}
