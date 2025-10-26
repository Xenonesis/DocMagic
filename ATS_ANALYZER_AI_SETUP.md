# ATS Analyzer AI Integration

## Overview

The ATS Analyzer now uses AI to provide intelligent resume analysis and suggestions. It supports two AI providers with automatic fallback:

1. **Primary**: OpenRouter with `meta-llama/llama-4-maverick:free`
2. **Fallback**: Google Gemini with `gemini-2.0-flash-exp`

## How It Works

### Priority Order

1. **OpenRouter First**: If `OPENROUTER_API_KEY` is available, it uses `meta-llama/llama-4-maverick:free` model
2. **Gemini Fallback**: If OpenRouter fails or is unavailable, it falls back to Gemini `2.0-flash-exp`
3. **Basic Analysis**: If both AI providers fail, it uses rule-based analysis

### Features

- **Keyword Analysis**: AI identifies missing keywords and suggests specific additions
- **Section Improvements**: AI recommends which resume sections need enhancement
- **Formatting Tips**: AI provides ATS-compatible formatting suggestions
- **Actionable Suggestions**: AI generates 3-5 specific, actionable improvements
- **Critical Issues**: AI highlights 2-3 critical problems that need immediate attention
- **Recommended Enhancements**: AI suggests 2-3 recommended improvements

## Environment Variables

Add these to your `.env.local` file:

```env
# OpenRouter Configuration (Primary - Free Model)
OPENROUTER_API_KEY=your-openrouter-api-key-here
OPENROUTER_MODEL=meta-llama/llama-4-maverick:free

# Gemini Configuration (Fallback)
GEMINI_API_KEY=your-gemini-api-key-here
# or
GOOGLE_API_KEY=your-google-api-key-here
```

## Getting API Keys

### OpenRouter (Recommended - Free Tier Available)

1. Visit https://openrouter.ai/
2. Sign up for a free account
3. Go to https://openrouter.ai/keys
4. Create a new API key
5. The `meta-llama/llama-4-maverick:free` model is completely free!

### Google Gemini (Fallback)

1. Visit https://aistudio.google.com/
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key
5. Gemini 2.0 Flash has a generous free tier

## API Response Format

```json
{
  "success": true,
  "score": 75,
  "analysis": {
    "keywordMatch": {
      "found": ["javascript", "react", "node"],
      "missing": ["typescript", "aws", "docker"],
      "score": 60
    },
    "sectionScores": {
      "experience": 100,
      "education": 100,
      "skills": 100,
      "summary": 0
    },
    "formattingScore": 85
  },
  "improvements": {
    "critical": [
      "Add a professional summary section at the top of your resume",
      "Include TypeScript in your skills section as it's mentioned 5 times in the job description"
    ],
    "recommended": [
      "Add more bullet points with quantifiable achievements",
      "Include AWS and Docker certifications if you have them"
    ],
    "aiSuggestions": [
      "Restructure your experience section to highlight React and Node.js projects first",
      "Add specific metrics: 'Improved application performance by X%' instead of 'Improved performance'",
      "Include a technical skills section with proficiency levels",
      "Add links to your GitHub portfolio showcasing TypeScript projects",
      "Tailor your professional summary to match the job's focus on full-stack development"
    ]
  }
}
```

## Testing

### Option 1: Use the Web Interface

1. Navigate to `http://localhost:3000/resume`
2. Click on "ATS Analyzer" tab
3. Upload a resume (PDF, DOCX, DOC, or TXT)
4. Paste a job description
5. Click "AI Resume Analysis"

### Option 2: Use the Test Page

1. Navigate to `http://localhost:3000/test-ats.html`
2. Upload a resume file
3. Paste a job description
4. Click "Analyze Resume"

### Option 3: API Testing

```bash
node test-ats-api.js
```

## Model Information

### meta-llama/llama-4-maverick:free

- **Cost**: FREE
- **Context**: 8K tokens
- **Strengths**: Fast, good for structured outputs, completely free
- **Best For**: Resume analysis, keyword extraction, suggestions

### gemini-2.0-flash-exp

- **Cost**: FREE (generous quota)
- **Context**: 32K tokens
- **Strengths**: Excellent reasoning, fast, multimodal
- **Best For**: Detailed analysis, complex suggestions

## Troubleshooting

### No AI Analysis (Using Basic Analysis)

- **Cause**: Neither API key is configured
- **Solution**: Add at least one API key to `.env.local`

### OpenRouter Errors

- **Cause**: Invalid API key or rate limit exceeded
- **Solution**: Check your API key, or wait for rate limit reset. System will automatically fallback to Gemini.

### Gemini Errors

- **Cause**: Invalid API key or quota exceeded
- **Solution**: Check your API key at https://aistudio.google.com/

### Both AI Providers Failed

- **Cause**: Network issues or both APIs are down
- **Solution**: System will use basic rule-based analysis as fallback

## Performance

- **Average Response Time**: 2-5 seconds with AI
- **Fallback Response Time**: <1 second with basic analysis
- **File Size Limit**: 10MB
- **Supported Formats**: PDF, DOCX, DOC, TXT

## Security

- API keys are stored securely in environment variables
- Resume text is not stored or logged
- All analysis is done in real-time
- No data is sent to third parties except the AI providers

## Future Enhancements

- [ ] Add more AI models (Claude, GPT-4, etc.)
- [ ] Implement caching for repeated analyses
- [ ] Add resume rewriting suggestions
- [ ] Generate optimized resume versions
- [ ] Add industry-specific analysis
- [ ] Implement batch processing
