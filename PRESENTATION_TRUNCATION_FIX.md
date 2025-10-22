# Presentation Generation Truncation Fix

## Problem
The presentation generation was failing with "Failed to parse AI response as JSON" because the AI response was being truncated mid-generation. The JSON output was incomplete, cutting off in the middle of chart data.

## Root Cause
The issue had two main causes:

1. **Insufficient Token Limits**: The `maxTokens` parameter was set too low (4000-6000 tokens) for complex presentations with 8+ slides containing images and charts.

2. **Free Model Limitations**: The configured model `google/gemma-3n-e2b-it:free` has a maximum output limit of ~4000 tokens, which isn't enough for complex presentations.

## Solutions Implemented

### 1. Increased Token Limits
- Increased default `maxTokens` from 4000 to 8000 in `generateOpenRouterCompletion()`
- Increased `maxTokens` from 6000 to 12000 in `generatePresentationOutline()`
- These limits work well for paid models with higher capacity

### 2. Free Model Detection & Adjustment
Added intelligent detection for free models that automatically:
- Reduces `maxTokens` to 4000 for free models to match their limits
- Limits presentation slides to 5 (from 8) when using free models
- Logs warnings when adjustments are made

### 3. Better Error Handling
Enhanced error messages to detect truncation:
- Checks if JSON response ends properly with `}` or `]`
- Provides specific error message: "AI response was truncated. Try increasing maxTokens or reducing the request size."
- Logs response length for debugging

### 4. Model Recommendations
Added comprehensive comments in `.env.local` explaining:
- Free model limitations (~4000 tokens)
- Alternative free models
- Recommended paid models with higher limits
- Quality vs cost tradeoffs

## Recommended Actions

### Option 1: Use a Better Free Model (Quick Fix)
Try these free alternatives that may have better limits:
```env
OPENROUTER_MODEL=meta-llama/llama-3.2-3b-instruct:free
# or
OPENROUTER_MODEL=qwen/qwen-2-7b-instruct:free
```

### Option 2: Upgrade to a Paid Model (Best Solution)
For reliable, high-quality presentations:
```env
# Best quality (recommended)
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# Good balance of quality and cost
OPENROUTER_MODEL=anthropic/claude-3-haiku

# Alternative options
OPENROUTER_MODEL=openai/gpt-4-turbo
OPENROUTER_MODEL=google/gemini-pro-1.5
```

### Option 3: Reduce Complexity (Temporary Workaround)
The code now automatically limits slides to 5 for free models, but you can manually request fewer slides when generating presentations.

## Testing
After implementing these changes:
1. Free models will automatically generate 5 slides max
2. Paid models can generate up to 12 slides with full complexity
3. Truncation errors will be detected and reported clearly

## Files Modified
- `lib/openrouter.ts` - Increased token limits, added free model detection, improved error handling
- `lib/gemini.ts` - Increased token limits, added slide count limiting for free models
- `.env.local` - Added model selection guidance and recommendations

## Cost Considerations
- Free models: $0 but limited output
- Claude 3 Haiku: ~$0.25 per 1M input tokens, ~$1.25 per 1M output tokens (very affordable)
- Claude 3.5 Sonnet: ~$3 per 1M input tokens, ~$15 per 1M output tokens (best quality)

A typical presentation generation uses ~2000-4000 tokens, costing $0.01-0.06 with paid models.
