/**
 * Multi-Language Translation Service
 * Integrates with AI providers for translation and localization
 */

import { generateAIResponse } from './ai-service';

export interface TranslationOptions {
  targetLanguage: string;
  sourceLanguage?: string;
  preserveFormatting?: boolean;
  context?: string; // Additional context for better translation
}

export interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence?: number;
}

export interface LocalizationOptions {
  targetLanguage: string;
  region?: string;
  dateFormat?: string;
  currencyFormat?: string;
  numberFormat?: string;
}

/**
 * Supported languages with their codes and names
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

class TranslationService {
  /**
   * Translate text from one language to another
   */
  async translateText(
    text: string,
    options: TranslationOptions
  ): Promise<TranslationResult> {
    const { targetLanguage, sourceLanguage = 'auto', preserveFormatting = true, context } = options;

    const systemPrompt = `You are a professional translator. Your task is to translate text accurately while preserving the original meaning, tone, and style.

${preserveFormatting ? 'IMPORTANT: Preserve all formatting, including markdown, HTML tags, line breaks, and special characters.' : ''}
${context ? `Context: ${context}` : ''}

Translate the text to ${this.getLanguageName(targetLanguage)}.
${sourceLanguage !== 'auto' ? `The source language is ${this.getLanguageName(sourceLanguage)}.` : 'Auto-detect the source language.'}

Return your response in the following JSON format:
{
  "translatedText": "translated text here",
  "detectedSourceLanguage": "language code",
  "confidence": 0.95
}`;

    const userPrompt = `Translate the following text:\n\n${text}`;

    try {
      const result = await generateAIResponse<{
        translatedText: string;
        detectedSourceLanguage: string;
        confidence: number;
      }>({
        systemPrompt,
        userPrompt,
        temperature: 0.3, // Lower temperature for more consistent translations
        maxTokens: 4000,
      });

      return {
        translatedText: result.translatedText,
        sourceLanguage: result.detectedSourceLanguage || sourceLanguage,
        targetLanguage,
        confidence: result.confidence,
      };
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Failed to translate text. Please try again.');
    }
  }

  /**
   * Translate multiple texts in batch
   */
  async translateBatch(
    texts: string[],
    options: TranslationOptions
  ): Promise<TranslationResult[]> {
    const promises = texts.map((text) => this.translateText(text, options));
    return Promise.all(promises);
  }

  /**
   * Localize content for specific region and format preferences
   */
  async localizeContent(
    content: Record<string, any>,
    options: LocalizationOptions
  ): Promise<Record<string, any>> {
    const { targetLanguage, region, dateFormat, currencyFormat, numberFormat } = options;

    const systemPrompt = `You are a localization expert. Adapt the content for ${this.getLanguageName(targetLanguage)} speakers${region ? ` in ${region}` : ''}.

Tasks:
1. Translate all text content
2. Adapt cultural references and idioms
3. ${dateFormat ? `Format dates as: ${dateFormat}` : 'Use local date format'}
4. ${currencyFormat ? `Format currency as: ${currencyFormat}` : 'Use local currency format'}
5. ${numberFormat ? `Format numbers as: ${numberFormat}` : 'Use local number format'}
6. Preserve all keys and structure of the JSON object

Return the localized content as a JSON object with the same structure.`;

    const userPrompt = `Localize this content:\n\n${JSON.stringify(content, null, 2)}`;

    try {
      const result = await generateAIResponse<Record<string, any>>({
        systemPrompt,
        userPrompt,
        temperature: 0.3,
        maxTokens: 6000,
      });

      return result;
    } catch (error) {
      console.error('Localization error:', error);
      throw new Error('Failed to localize content. Please try again.');
    }
  }

  /**
   * Detect language of text
   */
  async detectLanguage(text: string): Promise<{ language: string; confidence: number }> {
    const systemPrompt = `You are a language detection expert. Identify the language of the provided text.

Return your response in the following JSON format:
{
  "language": "language code (ISO 639-1)",
  "confidence": 0.95
}`;

    const userPrompt = `Detect the language of this text:\n\n${text}`;

    try {
      const result = await generateAIResponse<{
        language: string;
        confidence: number;
      }>({
        systemPrompt,
        userPrompt,
        temperature: 0.1,
        maxTokens: 100,
      });

      return result;
    } catch (error) {
      console.error('Language detection error:', error);
      throw new Error('Failed to detect language. Please try again.');
    }
  }

  /**
   * Get language name from code
   */
  getLanguageName(code: string): string {
    const language = SUPPORTED_LANGUAGES.find((lang) => lang.code === code);
    return language ? language.name : code;
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages() {
    return SUPPORTED_LANGUAGES;
  }

  /**
   * Check if language is supported
   */
  isLanguageSupported(code: string): boolean {
    return SUPPORTED_LANGUAGES.some((lang) => lang.code === code);
  }
}

// Export singleton instance
export const translationService = new TranslationService();
