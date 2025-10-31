/**
 * Content Personalization Engine
 * AI-powered personalization based on user preferences, industry, and context
 */

import { generateAIResponse } from './ai-service';

export interface UserPreferences {
  industry?: string;
  role?: string;
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive';
  tonePreference?: 'professional' | 'casual' | 'creative' | 'technical' | 'academic';
  stylePreference?: 'concise' | 'detailed' | 'storytelling' | 'data-driven';
  targetAudience?: string;
  keywords?: string[];
  avoidWords?: string[];
}

export interface PersonalizationOptions {
  preferences: UserPreferences;
  documentType: 'resume' | 'cover-letter' | 'cv' | 'presentation' | 'report' | 'email' | 'other';
  context?: string;
  preserveStructure?: boolean;
}

export interface PersonalizationResult {
  personalizedContent: string;
  changes: Array<{
    section: string;
    original: string;
    personalized: string;
    reason: string;
  }>;
  suggestions: string[];
  toneScore: number;
  relevanceScore: number;
}

export interface ContentSuggestion {
  type: 'improvement' | 'addition' | 'removal' | 'rewrite';
  section: string;
  original?: string;
  suggested: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  impact: string;
}

class PersonalizationService {
  /**
   * Personalize content based on user preferences
   */
  async personalizeContent(
    content: string,
    options: PersonalizationOptions
  ): Promise<PersonalizationResult> {
    const { preferences, documentType, context, preserveStructure = true } = options;

    const systemPrompt = this.buildPersonalizationPrompt(preferences, documentType, context, preserveStructure);
    const userPrompt = `Personalize the following ${documentType} content:\n\n${content}`;

    try {
      const result = await generateAIResponse<PersonalizationResult>({
        systemPrompt,
        userPrompt,
        temperature: 0.7,
        maxTokens: 6000,
      });

      return result;
    } catch (error) {
      console.error('Personalization error:', error);
      throw new Error('Failed to personalize content. Please try again.');
    }
  }

  /**
   * Generate smart content suggestions for improvement
   */
  async generateSuggestions(
    content: string,
    options: PersonalizationOptions
  ): Promise<ContentSuggestion[]> {
    const { preferences, documentType, context } = options;

    const systemPrompt = `You are an expert content advisor specializing in ${documentType} optimization.

User Profile:
${this.formatUserProfile(preferences)}

${context ? `Additional Context: ${context}` : ''}

Analyze the content and provide specific, actionable suggestions to improve:
1. Relevance to ${preferences.industry || 'their industry'}
2. Tone and style alignment with preferences
3. Impact and effectiveness
4. Industry-specific terminology
5. Missing sections or key information
6. Overly generic or weak statements
7. Better wording and phrasing

Return your response as a JSON array of suggestions with this structure:
[
  {
    "type": "improvement|addition|removal|rewrite",
    "section": "section name or location",
    "original": "original text (if applicable)",
    "suggested": "suggested text or action",
    "reason": "clear explanation of why this change is recommended",
    "priority": "high|medium|low",
    "impact": "description of the expected impact"
  }
]

Focus on high-impact, specific suggestions rather than generic advice.`;

    const userPrompt = `Analyze this ${documentType} content and provide suggestions:\n\n${content}`;

    try {
      const result = await generateAIResponse<ContentSuggestion[]>({
        systemPrompt,
        userPrompt,
        temperature: 0.7,
        maxTokens: 4000,
      });

      return result;
    } catch (error) {
      console.error('Suggestion generation error:', error);
      throw new Error('Failed to generate suggestions. Please try again.');
    }
  }

  /**
   * Adapt content tone and style
   */
  async adaptToneAndStyle(
    content: string,
    preferences: UserPreferences
  ): Promise<{ adaptedContent: string; changes: string[] }> {
    const systemPrompt = `You are a professional writing coach. Adapt the tone and style of the content according to these preferences:

Tone: ${preferences.tonePreference || 'professional'}
Style: ${preferences.stylePreference || 'balanced'}
Target Audience: ${preferences.targetAudience || 'general professional'}

Guidelines:
1. Maintain the core message and facts
2. Adjust language complexity and formality
3. Modify sentence structure to match style
4. Use appropriate vocabulary for the tone
5. Preserve technical accuracy

Return your response in JSON format:
{
  "adaptedContent": "the adapted content",
  "changes": ["list of key changes made"]
}`;

    const userPrompt = `Adapt this content:\n\n${content}`;

    try {
      const result = await generateAIResponse<{
        adaptedContent: string;
        changes: string[];
      }>({
        systemPrompt,
        userPrompt,
        temperature: 0.7,
        maxTokens: 4000,
      });

      return result;
    } catch (error) {
      console.error('Tone adaptation error:', error);
      throw new Error('Failed to adapt tone and style. Please try again.');
    }
  }

  /**
   * Optimize content for specific industry
   */
  async optimizeForIndustry(
    content: string,
    industry: string,
    role?: string
  ): Promise<{ optimizedContent: string; industryTerms: string[]; improvements: string[] }> {
    const systemPrompt = `You are an industry expert in ${industry}${role ? ` with deep knowledge of ${role} roles` : ''}.

Optimize the content by:
1. Using industry-specific terminology and jargon appropriately
2. Highlighting relevant skills and experiences for ${industry}
3. Emphasizing industry trends and best practices
4. Removing generic statements
5. Adding impact with industry-recognized achievements

Return your response in JSON format:
{
  "optimizedContent": "the optimized content",
  "industryTerms": ["list of industry-specific terms added"],
  "improvements": ["list of key improvements made"]
}`;

    const userPrompt = `Optimize this content for the ${industry} industry:\n\n${content}`;

    try {
      const result = await generateAIResponse<{
        optimizedContent: string;
        industryTerms: string[];
        improvements: string[];
      }>({
        systemPrompt,
        userPrompt,
        temperature: 0.7,
        maxTokens: 4000,
      });

      return result;
    } catch (error) {
      console.error('Industry optimization error:', error);
      throw new Error('Failed to optimize for industry. Please try again.');
    }
  }

  /**
   * Build personalization prompt based on preferences
   */
  private buildPersonalizationPrompt(
    preferences: UserPreferences,
    documentType: string,
    context?: string,
    preserveStructure?: boolean
  ): string {
    return `You are an expert ${documentType} writer and personalization specialist.

User Profile:
${this.formatUserProfile(preferences)}

${context ? `Additional Context: ${context}` : ''}

Task: Personalize the content to align with the user's profile and preferences while maintaining professionalism and impact.

Personalization Guidelines:
1. Adapt tone to match: ${preferences.tonePreference || 'professional'}
2. Adjust style for: ${preferences.stylePreference || 'balanced'}
3. Optimize for ${preferences.industry || 'general'} industry
4. Target ${preferences.experienceLevel || 'general'} experience level
5. ${preferences.keywords?.length ? `Emphasize keywords: ${preferences.keywords.join(', ')}` : ''}
6. ${preferences.avoidWords?.length ? `Avoid words: ${preferences.avoidWords.join(', ')}` : ''}
7. ${preserveStructure ? 'Preserve the overall structure and formatting' : 'Feel free to restructure as needed'}

Return your response in JSON format:
{
  "personalizedContent": "the fully personalized content",
  "changes": [
    {
      "section": "section name",
      "original": "original text snippet",
      "personalized": "personalized text snippet",
      "reason": "why this change was made"
    }
  ],
  "suggestions": ["additional suggestions for further improvement"],
  "toneScore": 0.0-1.0 (how well it matches the preferred tone),
  "relevanceScore": 0.0-1.0 (how relevant it is to their industry/role)
}`;
  }

  /**
   * Format user profile for prompts
   */
  private formatUserProfile(preferences: UserPreferences): string {
    const profile: string[] = [];

    if (preferences.industry) profile.push(`Industry: ${preferences.industry}`);
    if (preferences.role) profile.push(`Role: ${preferences.role}`);
    if (preferences.experienceLevel) profile.push(`Experience Level: ${preferences.experienceLevel}`);
    if (preferences.tonePreference) profile.push(`Preferred Tone: ${preferences.tonePreference}`);
    if (preferences.stylePreference) profile.push(`Preferred Style: ${preferences.stylePreference}`);
    if (preferences.targetAudience) profile.push(`Target Audience: ${preferences.targetAudience}`);
    if (preferences.keywords?.length) profile.push(`Keywords: ${preferences.keywords.join(', ')}`);
    if (preferences.avoidWords?.length) profile.push(`Words to Avoid: ${preferences.avoidWords.join(', ')}`);

    return profile.length > 0 ? profile.join('\n') : 'No specific preferences set';
  }

  /**
   * Get common industries for selection
   */
  getCommonIndustries(): string[] {
    return [
      'Technology',
      'Software Engineering',
      'Finance',
      'Healthcare',
      'Education',
      'Marketing',
      'Sales',
      'Consulting',
      'Legal',
      'Manufacturing',
      'Retail',
      'Real Estate',
      'Media & Entertainment',
      'Non-profit',
      'Government',
      'Hospitality',
      'Transportation',
      'Energy',
      'Telecommunications',
      'Aerospace',
      'Automotive',
      'Biotechnology',
      'Pharmaceutical',
      'Construction',
      'Agriculture',
    ];
  }

  /**
   * Get tone options
   */
  getToneOptions() {
    return [
      { value: 'professional', label: 'Professional', description: 'Formal and business-appropriate' },
      { value: 'casual', label: 'Casual', description: 'Friendly and approachable' },
      { value: 'creative', label: 'Creative', description: 'Innovative and engaging' },
      { value: 'technical', label: 'Technical', description: 'Precise and detailed' },
      { value: 'academic', label: 'Academic', description: 'Scholarly and research-oriented' },
    ];
  }

  /**
   * Get style options
   */
  getStyleOptions() {
    return [
      { value: 'concise', label: 'Concise', description: 'Brief and to-the-point' },
      { value: 'detailed', label: 'Detailed', description: 'Comprehensive and thorough' },
      { value: 'storytelling', label: 'Storytelling', description: 'Narrative and engaging' },
      { value: 'data-driven', label: 'Data-driven', description: 'Focused on metrics and results' },
    ];
  }
}

// Export singleton instance
export const personalizationService = new PersonalizationService();
