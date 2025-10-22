# Subscription-Based Slide Limits Implementation

## Overview
Implemented a subscription-based slide limit system for presentations:
- **Free users**: Maximum 5 slides
- **Premium users**: Maximum 30 slides (ready for future implementation)
- **Current behavior**: All users limited to 5 slides until subscription system is fully integrated

## Changes Made

### 1. Created Subscription Utilities (`lib/subscription-utils.ts`)
New utility module for managing subscription limits:

```typescript
export const SUBSCRIPTION_LIMITS = {
  FREE: {
    MAX_SLIDES: 5,
    MAX_DOCUMENTS: 10,
  },
  PREMIUM: {
    MAX_SLIDES: 30,
    MAX_DOCUMENTS: -1, // unlimited
  },
}
```

**Key Functions:**
- `checkUserSubscription(userId)` - Checks if user has active premium subscription
- `getMaxSlidesForUser(userId)` - Returns max slides allowed for user
- `validateSlideCount(requestedSlides, userId)` - Validates if requested slides are within limits

**Features:**
- Queries Supabase `subscriptions` table for active subscriptions
- Validates subscription expiry dates
- Defaults to free tier on errors (fail-safe)
- Returns detailed subscription status including `isPremium`, `maxSlides`, etc.

### 2. Updated API Route (`app/api/generate/presentation-outline/route.ts`)
Enhanced the presentation outline API to enforce limits:

**Changes:**
- Added `userId` parameter to request body
- Validates slide count against user's subscription before generation
- Returns 403 error with upgrade message if limit exceeded
- Caps slide count to user's limit as safety measure
- Returns subscription info in response (`maxSlides`, `isPremium`)

**Error Response Example:**
```json
{
  "error": "Slide limit exceeded. Free users can create up to 5 slides.",
  "maxAllowed": 5,
  "isPremium": false,
  "upgradeRequired": true
}
```

### 3. Updated Frontend Component (`components/presentation/presentation-generator.tsx`)
Enhanced the presentation generator UI:

**Changes:**
- Updated default `pageCount` from 8 to 5
- Changed `MAX_FREE_PAGES` from 8 to 5
- Changed `MAX_PRO_PAGES` from 100 to 30
- Passes `userId` to API for subscription validation
- Handles 403 errors with upgrade prompts
- Shows clear error messages for limit violations

**UI Features:**
- Input field max value respects subscription limits
- Shows "Max 5 slides (Pro: 30)" badge for free users
- Displays upgrade prompts when limits exceeded

### 4. Maintained Free Model Protection (`lib/gemini.ts`)
Kept the existing free AI model protection:
- Free AI models (like `gemma-3n-e2b-it:free`) still limited to 5 slides
- Prevents token truncation issues
- Works in conjunction with subscription limits

## How It Works

### For Free Users (Current Default)
1. User sets slide count in UI (max 5)
2. Frontend sends request with `userId` and `pageCount`
3. API validates against free tier limit (5 slides)
4. If valid, generates presentation
5. If exceeded, returns 403 with upgrade message

### For Premium Users (Future)
1. When subscription system is integrated:
   - Set `isPro = true` based on subscription check
   - User can create up to 30 slides
   - API validates against premium limit (30 slides)
   - No upgrade prompts shown

### Database Schema
Uses existing Supabase `subscriptions` table:
```typescript
{
  id: string
  user_id: string
  stripe_subscription_id: string
  stripe_price_id: string
  stripe_current_period_end: string
  status: string  // 'active', 'canceled', etc.
  created_at: string
  updated_at: string
}
```

## Integration Steps for Full Subscription System

### Step 1: Enable Subscription Checks in Frontend
Update `components/presentation/presentation-generator.tsx`:
```typescript
// Replace this line:
const isPro = false;

// With actual subscription check:
const [isPro, setIsPro] = useState(false);

useEffect(() => {
  if (user?.id) {
    checkUserSubscription(user.id).then(sub => {
      setIsPro(sub.isPremium);
    });
  }
}, [user]);
```

### Step 2: Add Subscription Context (Optional)
Create a subscription context provider for app-wide access:
```typescript
// contexts/subscription-context.tsx
export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  
  useEffect(() => {
    if (user?.id) {
      checkUserSubscription(user.id).then(setSubscription);
    }
  }, [user]);
  
  return (
    <SubscriptionContext.Provider value={subscription}>
      {children}
    </SubscriptionContext.Provider>
  );
};
```

### Step 3: Add Upgrade Flow
Create upgrade prompts and Stripe integration:
- Add "Upgrade to Premium" button in UI
- Link to pricing/checkout page
- Handle Stripe webhooks for subscription updates
- Update subscription status in database

## Testing

### Test Free User Limits
1. Try creating presentation with 6 slides
2. Should see error: "Slide limit exceeded. Free users can create up to 5 slides."
3. Reduce to 5 slides - should work

### Test Premium User Limits (When Enabled)
1. Create active subscription in database
2. Try creating presentation with 30 slides
3. Should work without errors
4. Try 31 slides - should see limit error

### Test API Directly
```bash
# Free user (no userId)
curl -X POST http://localhost:3000/api/generate/presentation-outline \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test", "pageCount": 6}'
# Expected: 403 error

# With valid userId and 5 slides
curl -X POST http://localhost:3000/api/generate/presentation-outline \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test", "pageCount": 5, "userId": "user-id-here"}'
# Expected: Success
```

## Benefits

1. **Clear Limits**: Users know exactly what they can create
2. **Upgrade Incentive**: Free users see value in premium (5 → 30 slides)
3. **Fail-Safe**: Defaults to free tier on errors
4. **Scalable**: Easy to adjust limits or add tiers
5. **Backend Enforced**: Can't be bypassed from frontend
6. **User-Friendly**: Clear error messages and upgrade prompts

## Future Enhancements

1. **Multiple Tiers**: Add "Pro" and "Enterprise" tiers
2. **Usage Tracking**: Track slides generated per month
3. **Soft Limits**: Allow occasional overages with warnings
4. **Team Plans**: Share limits across team members
5. **Custom Limits**: Per-user custom limits for enterprise
6. **Analytics**: Track upgrade conversion rates

## Files Modified

- ✅ `lib/subscription-utils.ts` - New subscription utility module
- ✅ `app/api/generate/presentation-outline/route.ts` - Added subscription validation
- ✅ `components/presentation/presentation-generator.tsx` - Updated limits and UI
- ✅ `lib/gemini.ts` - Maintained free model protection

## Current Status

✅ **Implemented**: Subscription limit infrastructure  
✅ **Working**: Free tier limits (5 slides)  
⏳ **Pending**: Premium tier activation (requires subscription integration)  
⏳ **Pending**: Stripe webhook handling  
⏳ **Pending**: Upgrade flow UI  

All users currently see free tier limits (5 slides max) until the subscription system is fully integrated.
