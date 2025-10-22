# OpenRouter Integration Guide

DocMagic now supports **OpenRouter** as the primary AI provider, giving you access to multiple AI models including Claude, GPT-4, Gemini, and more through a single API.

## Features

✅ **Multiple AI Models**: Choose from Claude 3.5 Sonnet, GPT-4, Gemini Pro, Llama, and more  
✅ **Automatic Fallback**: Falls back to Gemini if OpenRouter is unavailable  
✅ **Model Selection**: Configure your preferred model via environment variables  
✅ **Cost Optimization**: Select models based on your budget and quality needs  
✅ **Unified Interface**: All document generation features work seamlessly with any model

## Supported Document Generation Features

All the following features now use OpenRouter (or Gemini as fallback):

- ✅ **Resume Generation** - Basic and guided resume creation
- ✅ **ATS-Optimized Resumes** - Keyword-optimized resumes for applicant tracking systems
- ✅ **Presentation Outlines** - Slide outlines with images and charts
- ✅ **Full Presentations** - Complete presentation generation with visuals
- ✅ **Cover Letters** - Professional cover letter generation
- ✅ **Resume Guidance** - Step-by-step resume building assistance
- ✅ **ATS Analysis** - Resume scoring against job descriptions
- ✅ **Diagram Generation** - Mermaid diagram creation

## Setup Instructions

### 1. Get Your OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/keys)
2. Sign up or log in
3. Create a new API key
4. Copy your API key

### 2. Configure Environment Variables

Update your `.env` file with the following:

```bash
# AI Provider Configuration
AI_PROVIDER=openrouter

# OpenRouter API Key (Required)
OPENROUTER_API_KEY=your-openrouter-api-key-here

# Model Selection (Optional - defaults to Claude 3.5 Sonnet)
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
```

### 3. Choose Your AI Model

OpenRouter supports many models. Here are some recommended options:

#### Premium Models (Best Quality)
```bash
# Claude 3.5 Sonnet - Excellent for complex tasks (Recommended)
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# GPT-4 Turbo - Great all-around performance
OPENROUTER_MODEL=openai/gpt-4-turbo

# Gemini Pro 1.5 - Strong reasoning capabilities
OPENROUTER_MODEL=google/gemini-pro-1.5
```

#### Balanced Models (Good Quality, Lower Cost)
```bash
# Claude 3 Haiku - Fast and cost-effective
OPENROUTER_MODEL=anthropic/claude-3-haiku

# GPT-3.5 Turbo - Reliable and affordable
OPENROUTER_MODEL=openai/gpt-3.5-turbo

# Llama 3.1 70B - Open source, good performance
OPENROUTER_MODEL=meta-llama/llama-3.1-70b-instruct
```

#### Economical Models (Budget-Friendly)
```bash
# GPT-3.5 Turbo - Most cost-effective OpenAI model
OPENROUTER_MODEL=openai/gpt-3.5-turbo

# Llama 3.1 8B - Very affordable
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct

# Gemini Flash 1.5 - Fast and cheap
OPENROUTER_MODEL=google/gemini-flash-1.5
```

### 4. (Optional) Keep Gemini as Fallback

You can keep your Gemini API key as a fallback option:

```bash
# Gemini API Key (Optional - used as fallback)
GEMINI_API_KEY=your-gemini-api-key-here
```

If OpenRouter fails, the system will automatically fall back to Gemini.

### 5. (Alternative) Use Gemini as Primary

To use Gemini as your primary AI provider:

```bash
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-api-key-here
```

## Model Comparison

| Model | Provider | Quality | Speed | Cost | Best For |
|-------|----------|---------|-------|------|----------|
| Claude 3.5 Sonnet | Anthropic | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | $$$ | Complex documents, ATS optimization |
| GPT-4 Turbo | OpenAI | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | $$$ | Professional content, presentations |
| Gemini Pro 1.5 | Google | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | $$ | Long documents, analysis |
| Claude 3 Haiku | Anthropic | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $ | Quick tasks, templates |
| GPT-3.5 Turbo | OpenAI | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $ | General purpose, high volume |
| Llama 3.1 70B | Meta | ⭐⭐⭐⭐ | ⭐⭐⭐ | $ | Open source, privacy-focused |

## Testing Your Configuration

After setting up, test your configuration:

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try generating a document (resume, presentation, or letter)

3. Check the console for any errors

4. The system will automatically log which AI provider is being used

## Troubleshooting

### "No AI provider configured" Error

**Solution**: Make sure you have either `OPENROUTER_API_KEY` or `GEMINI_API_KEY` set in your `.env` file.

### "OpenRouter API error: 401"

**Solution**: Your API key is invalid. Double-check your `OPENROUTER_API_KEY` in the `.env` file.

### "Failed to generate response"

**Solutions**:
1. Check your internet connection
2. Verify your API key is active on OpenRouter
3. Ensure you have credits/balance on your OpenRouter account
4. Try a different model

### Model Not Found Error

**Solution**: Verify the model name is correct. Check [OpenRouter Models](https://openrouter.ai/models) for the full list of available models.

## Cost Management

### Tips for Managing Costs

1. **Use economical models for testing**: Start with `gpt-3.5-turbo` or `claude-3-haiku`
2. **Premium models for production**: Use `claude-3.5-sonnet` or `gpt-4-turbo` for final documents
3. **Monitor usage**: Check your OpenRouter dashboard regularly
4. **Set limits**: Configure spending limits in your OpenRouter account
5. **Optimize prompts**: Shorter, clearer prompts use fewer tokens

### Estimated Costs (Approximate)

- **Resume Generation**: $0.01 - $0.10 per resume (depending on model)
- **Presentation**: $0.05 - $0.30 per presentation (depending on slides and model)
- **Cover Letter**: $0.01 - $0.05 per letter
- **ATS Analysis**: $0.02 - $0.10 per analysis

*Costs vary based on model selection and document complexity*

## Advanced Configuration

### Custom Model Parameters

You can customize the AI behavior by modifying the parameters in `lib/ai-service.ts`:

```typescript
const response = await generateAIResponse({
  systemPrompt: "Your system prompt",
  userPrompt: "Your user prompt",
  temperature: 0.7,  // Creativity (0.0 - 1.0)
  maxTokens: 4000,   // Maximum response length
});
```

### Using Multiple Models

You can programmatically switch models by passing the `model` parameter:

```typescript
import { generateStructuredResponse } from '@/lib/openrouter';

const response = await generateStructuredResponse({
  systemPrompt: "...",
  userPrompt: "...",
  model: "openai/gpt-4-turbo", // Override default model
});
```

## Support

For issues or questions:

1. Check the [OpenRouter Documentation](https://openrouter.ai/docs)
2. Review the [OpenRouter Discord](https://discord.gg/openrouter)
3. Open an issue on the DocMagic GitHub repository

## Migration from Gemini-Only

If you were previously using only Gemini:

1. Your existing Gemini setup will continue to work
2. Add OpenRouter configuration to enable new models
3. Set `AI_PROVIDER=openrouter` to switch
4. Keep `GEMINI_API_KEY` as a fallback option
5. No code changes needed - everything is backward compatible

---

**Note**: OpenRouter requires an active account with available credits. Visit [OpenRouter](https://openrouter.ai) to set up your account and add credits.
