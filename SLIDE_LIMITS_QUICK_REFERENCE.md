# Slide Limits Quick Reference

## Current Configuration

### Limits
- **Free Users**: 5 slides maximum
- **Premium Users**: 30 slides maximum (ready for activation)
- **Current Behavior**: All users limited to 5 slides

### Where Limits Are Defined

1. **Backend** (`lib/subscription-utils.ts`):
   ```typescript
   SUBSCRIPTION_LIMITS = {
     FREE: { MAX_SLIDES: 5 },
     PREMIUM: { MAX_SLIDES: 30 }
   }
   ```

2. **Frontend** (`components/presentation/presentation-generator.tsx`):
   ```typescript
   const MAX_FREE_PAGES = 5;
   const MAX_PRO_PAGES = 30;
   const isPro = false; // Currently all users are free
   ```

3. **API** (`app/api/generate/presentation-outline/route.ts`):
   - Validates against subscription limits
   - Returns 403 if exceeded

## How to Change Limits

### Option 1: Change for All Users (Quick)
Edit `components/presentation/presentation-generator.tsx`:
```typescript
const MAX_FREE_PAGES = 10; // Change from 5 to 10
```

### Option 2: Change Backend Limits (Recommended)
Edit `lib/subscription-utils.ts`:
```typescript
export const SUBSCRIPTION_LIMITS = {
  FREE: { MAX_SLIDES: 10 },    // Change from 5
  PREMIUM: { MAX_SLIDES: 50 }  // Change from 30
}
```

### Option 3: Enable Premium for Specific User
Add subscription to database:
```sql
INSERT INTO subscriptions (user_id, status, stripe_current_period_end)
VALUES ('user-id-here', 'active', '2025-12-31');
```

## Testing Different Scenarios

### Test as Free User
1. Open presentation generator
2. Set slides to 6
3. Click generate
4. Should see: "Slide limit exceeded. Free users can create up to 5 slides."

### Test as Premium User (When Enabled)
1. Set `isPro = true` in component
2. Set slides to 30
3. Should work without errors

### Test API Limits
```bash
# Test free limit (should fail)
curl -X POST http://localhost:3000/api/generate/presentation-outline \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Solar System", "pageCount": 6}'

# Test within limit (should work)
curl -X POST http://localhost:3000/api/generate/presentation-outline \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Solar System", "pageCount": 5}'
```

## Activation Checklist

To enable premium subscriptions:

- [ ] Set up Stripe subscription products
- [ ] Configure webhook handlers
- [ ] Update `isPro` check in frontend:
  ```typescript
  const [isPro, setIsPro] = useState(false);
  
  useEffect(() => {
    if (user?.id) {
      checkUserSubscription(user.id).then(sub => {
        setIsPro(sub.isPremium);
      });
    }
  }, [user]);
  ```
- [ ] Add upgrade button/flow
- [ ] Test subscription creation
- [ ] Test subscription expiry
- [ ] Test limit enforcement

## Common Issues

### Issue: Users can still create more than 5 slides
**Solution**: Check that API is receiving `userId` parameter

### Issue: Premium users limited to 5 slides
**Solution**: Verify subscription status in database and `isPro` flag

### Issue: API returns 500 instead of 403
**Solution**: Check Supabase connection and subscription table exists

## Quick Fixes

### Temporarily Increase Free Limit
```typescript
// In lib/subscription-utils.ts
FREE: { MAX_SLIDES: 10 } // Increase from 5
```

### Disable Limits (Development Only)
```typescript
// In app/api/generate/presentation-outline/route.ts
// Comment out validation:
// const validation = await validateSlideCount(pageCount, userId);
// if (!validation.valid) { ... }
```

### Force Premium for Testing
```typescript
// In components/presentation/presentation-generator.tsx
const isPro = true; // Force premium mode
```

## Architecture

```
User Input (5 slides)
    ↓
Frontend Validation (max 5 for free)
    ↓
API Request (with userId)
    ↓
Backend Validation (checks subscription)
    ↓
AI Generation (respects limits)
    ↓
Response (with subscription info)
```

## Key Files

1. `lib/subscription-utils.ts` - Subscription logic
2. `app/api/generate/presentation-outline/route.ts` - API validation
3. `components/presentation/presentation-generator.tsx` - UI limits
4. `lib/gemini.ts` - AI generation (also has free model limits)

## Support

For questions or issues:
1. Check `SUBSCRIPTION_LIMITS_IMPLEMENTATION.md` for detailed docs
2. Review `PRESENTATION_TRUNCATION_FIX.md` for AI model limits
3. Test with different slide counts to verify behavior
