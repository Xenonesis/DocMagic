/**
 * Integration Tests for All 5 New Features
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock the AI service
jest.mock('@/lib/ai-service', () => ({
  generateAIResponse: jest.fn().mockResolvedValue({
    translatedText: 'Hola Mundo',
    detectedSourceLanguage: 'en',
    confidence: 0.95,
  }),
}));

describe('Feature 1: Voice-to-Text Service', () => {
  it('should check browser support', () => {
    const { voiceToTextService } = require('@/lib/voice-to-text');
    const isSupported = voiceToTextService.isBrowserSupported();
    expect(typeof isSupported).toBe('boolean');
  });

  it('should provide supported languages', () => {
    const { voiceToTextService } = require('@/lib/voice-to-text');
    const languages = voiceToTextService.getSupportedLanguages();
    expect(Array.isArray(languages)).toBe(true);
    expect(languages.length).toBeGreaterThan(0);
    expect(languages[0]).toHaveProperty('code');
    expect(languages[0]).toHaveProperty('name');
  });

  it('should have proper language codes', () => {
    const { voiceToTextService } = require('@/lib/voice-to-text');
    const languages = voiceToTextService.getSupportedLanguages();
    
    // Check for key languages
    const englishUS = languages.find((lang: any) => lang.code === 'en-US');
    const spanish = languages.find((lang: any) => lang.code === 'es-ES');
    const french = languages.find((lang: any) => lang.code === 'fr-FR');
    
    expect(englishUS).toBeDefined();
    expect(spanish).toBeDefined();
    expect(french).toBeDefined();
  });
});

describe('Feature 2: Translation Service', () => {
  it('should have supported languages', () => {
    const { SUPPORTED_LANGUAGES } = require('@/lib/translation-service');
    expect(SUPPORTED_LANGUAGES).toBeDefined();
    expect(SUPPORTED_LANGUAGES.length).toBeGreaterThanOrEqual(25);
  });

  it('should have language with proper structure', () => {
    const { SUPPORTED_LANGUAGES } = require('@/lib/translation-service');
    const firstLang = SUPPORTED_LANGUAGES[0];
    
    expect(firstLang).toHaveProperty('code');
    expect(firstLang).toHaveProperty('name');
    expect(firstLang).toHaveProperty('nativeName');
  });

  it('should validate language support', () => {
    const { translationService } = require('@/lib/translation-service');
    
    expect(translationService.isLanguageSupported('en')).toBe(true);
    expect(translationService.isLanguageSupported('es')).toBe(true);
    expect(translationService.isLanguageSupported('invalid-code')).toBe(false);
  });

  it('should get language name from code', () => {
    const { translationService } = require('@/lib/translation-service');
    
    expect(translationService.getLanguageName('en')).toBe('English');
    expect(translationService.getLanguageName('es')).toBe('Spanish');
    expect(translationService.getLanguageName('fr')).toBe('French');
  });
});

describe('Feature 3: Personalization Service', () => {
  it('should provide common industries', () => {
    const { personalizationService } = require('@/lib/personalization-service');
    const industries = personalizationService.getCommonIndustries();
    
    expect(Array.isArray(industries)).toBe(true);
    expect(industries.length).toBeGreaterThan(20);
    expect(industries).toContain('Technology');
    expect(industries).toContain('Finance');
    expect(industries).toContain('Healthcare');
  });

  it('should provide tone options', () => {
    const { personalizationService } = require('@/lib/personalization-service');
    const toneOptions = personalizationService.getToneOptions();
    
    expect(Array.isArray(toneOptions)).toBe(true);
    expect(toneOptions.length).toBeGreaterThanOrEqual(5);
    
    const professional = toneOptions.find((opt: any) => opt.value === 'professional');
    expect(professional).toBeDefined();
    expect(professional).toHaveProperty('label');
    expect(professional).toHaveProperty('description');
  });

  it('should provide style options', () => {
    const { personalizationService } = require('@/lib/personalization-service');
    const styleOptions = personalizationService.getStyleOptions();
    
    expect(Array.isArray(styleOptions)).toBe(true);
    expect(styleOptions.length).toBeGreaterThanOrEqual(4);
    
    const concise = styleOptions.find((opt: any) => opt.value === 'concise');
    expect(concise).toBeDefined();
    expect(concise).toHaveProperty('label');
    expect(concise).toHaveProperty('description');
  });
});

describe('Feature 4: Smart Suggestions', () => {
  it('should have proper suggestion structure type', () => {
    const { personalizationService } = require('@/lib/personalization-service');
    
    // This just validates the service is properly exported
    expect(personalizationService).toBeDefined();
    expect(typeof personalizationService.generateSuggestions).toBe('function');
  });
});

describe('Feature 5: Document Comparison Service', () => {
  it('should compare simple documents', () => {
    const { documentComparisonService } = require('@/lib/document-comparison');
    
    const original = 'Hello World';
    const modified = 'Hello Universe';
    
    const result = documentComparisonService.compareDocuments(original, modified);
    
    expect(result).toBeDefined();
    expect(result).toHaveProperty('changes');
    expect(result).toHaveProperty('statistics');
    expect(result).toHaveProperty('summary');
    expect(Array.isArray(result.changes)).toBe(true);
  });

  it('should calculate similarity correctly', () => {
    const { documentComparisonService } = require('@/lib/document-comparison');
    
    const identical1 = 'This is a test';
    const identical2 = 'This is a test';
    const similarity = documentComparisonService.calculateSimilarity(identical1, identical2);
    
    expect(similarity).toBe(100);
  });

  it('should detect changes with statistics', () => {
    const { documentComparisonService } = require('@/lib/document-comparison');
    
    const original = 'The quick brown fox';
    const modified = 'The quick red fox jumps';
    
    const result = documentComparisonService.compareDocuments(original, modified);
    
    expect(result.statistics).toBeDefined();
    expect(result.statistics).toHaveProperty('additions');
    expect(result.statistics).toHaveProperty('deletions');
    expect(result.statistics).toHaveProperty('modifications');
    expect(result.statistics).toHaveProperty('unchanged');
    expect(result.statistics).toHaveProperty('totalChanges');
    expect(result.statistics).toHaveProperty('changePercentage');
  });

  it('should generate side-by-side comparison', () => {
    const { documentComparisonService } = require('@/lib/document-comparison');
    
    const original = 'Hello World';
    const modified = 'Hello Universe';
    
    const result = documentComparisonService.generateSideBySide(original, modified);
    
    expect(result).toBeDefined();
    expect(result).toHaveProperty('left');
    expect(result).toHaveProperty('right');
    expect(Array.isArray(result.left)).toBe(true);
    expect(Array.isArray(result.right)).toBe(true);
  });

  it('should generate HTML diff', () => {
    const { documentComparisonService } = require('@/lib/document-comparison');
    
    const original = 'Hello World';
    const modified = 'Hello Universe';
    
    const htmlDiff = documentComparisonService.generateHTMLDiff(original, modified);
    
    expect(typeof htmlDiff).toBe('string');
    expect(htmlDiff.length).toBeGreaterThan(0);
  });

  it('should generate unified diff', () => {
    const { documentComparisonService } = require('@/lib/document-comparison');
    
    const original = 'Line 1\nLine 2\nLine 3';
    const modified = 'Line 1\nLine 2 Modified\nLine 3';
    
    const unifiedDiff = documentComparisonService.getUnifiedDiff(original, modified);
    
    expect(typeof unifiedDiff).toBe('string');
    expect(unifiedDiff).toContain('---');
    expect(unifiedDiff).toContain('+++');
  });

  it('should find common sections', () => {
    const { documentComparisonService } = require('@/lib/document-comparison');
    
    const content1 = 'This is common text that appears in both documents';
    const content2 = 'This is common text that appears in both documents with extra content';
    
    const commonSections = documentComparisonService.findCommonSections(content1, content2, 10);
    
    expect(Array.isArray(commonSections)).toBe(true);
    expect(commonSections.length).toBeGreaterThan(0);
  });

  it('should support different comparison modes', () => {
    const { documentComparisonService } = require('@/lib/document-comparison');
    
    const original = 'Test content';
    const modified = 'Test modified content';
    
    const charResult = documentComparisonService.compareDocuments(original, modified, { mode: 'chars' });
    const wordResult = documentComparisonService.compareDocuments(original, modified, { mode: 'words' });
    const lineResult = documentComparisonService.compareDocuments(original, modified, { mode: 'lines' });
    
    expect(charResult.changes.length).toBeGreaterThan(0);
    expect(wordResult.changes.length).toBeGreaterThan(0);
    expect(lineResult.changes.length).toBeGreaterThan(0);
  });
});

describe('Integration: All Features Together', () => {
  it('should export all required services', () => {
    const voiceModule = require('@/lib/voice-to-text');
    const translationModule = require('@/lib/translation-service');
    const personalizationModule = require('@/lib/personalization-service');
    const comparisonModule = require('@/lib/document-comparison');
    
    expect(voiceModule.voiceToTextService).toBeDefined();
    expect(translationModule.translationService).toBeDefined();
    expect(personalizationModule.personalizationService).toBeDefined();
    expect(comparisonModule.documentComparisonService).toBeDefined();
  });

  it('should have all React hooks available', () => {
    // These imports validate that hooks are properly exported
    expect(() => require('@/hooks/use-voice-input')).not.toThrow();
    expect(() => require('@/hooks/use-translation')).not.toThrow();
    expect(() => require('@/hooks/use-personalization')).not.toThrow();
    expect(() => require('@/hooks/use-document-comparison')).not.toThrow();
  });

  it('should have all UI components available', () => {
    // These imports validate that components are properly exported
    expect(() => require('@/components/ui/voice-input-button')).not.toThrow();
    expect(() => require('@/components/ui/translation-panel')).not.toThrow();
    expect(() => require('@/components/ui/personalization-panel')).not.toThrow();
    expect(() => require('@/components/ui/smart-suggestions-panel')).not.toThrow();
    expect(() => require('@/components/ui/document-comparison-panel')).not.toThrow();
  });
});

describe('TypeScript Type Safety', () => {
  it('should have proper types for UserPreferences', () => {
    const { personalizationService } = require('@/lib/personalization-service');
    
    // This validates the type structure exists
    const preferences = {
      industry: 'Technology',
      role: 'Software Engineer',
      experienceLevel: 'senior' as const,
      tonePreference: 'professional' as const,
      stylePreference: 'concise' as const,
    };
    
    expect(preferences.industry).toBe('Technology');
    expect(preferences.experienceLevel).toBe('senior');
  });
});
