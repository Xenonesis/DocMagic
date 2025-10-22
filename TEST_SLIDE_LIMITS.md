# Test Slide Limits - Quick Test Guide

## Quick Test Scenarios

### Test 1: Free User - Within Limit (Should Work)
1. Open presentation generator
2. Enter prompt: "Solar System Overview"
3. Set slides: **5**
4. Click "Generate Outline"
5. ✅ **Expected**: Presentation generates successfully

### Test 2: Free User - Exceeds Limit (Should Fail)
1. Open presentation generator
2. Enter prompt: "Solar System Overview"
3. Set slides: **6**
4. Click "Generate Outline"
5. ✅ **Expected**: Error message "Slide limit exceeded. Free users can create up to 5 slides."

### Test 3: API Direct Test - Within Limit
```bash
curl -X POST http://localhost:3000/api/generate/presentation-outline \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Solar System Overview",
    "pageCount": 5
  }'
```
✅ **Expected**: JSON response with 5 slide outlines

### Test 4: API Direct Test - Exceeds Limit
```bash
curl -X POST http://localhost:3000/api/generate/presentation-outline \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Solar System Overview",
    "pageCount": 6
  }'
```
✅ **Expected**: 403 error with message about upgrade

### Test 5: UI Limit Enforcement
1. Open presentation generator
2. Try to type "10" in the slide count input
3. ✅ **Expected**: Input automatically caps at 5
4. ✅ **Expected**: Badge shows "Max 5 slides (Pro: 30)"

## Visual Verification

### What You Should See

#### Input Section
```
Number of Slides
[5] 🔒 Max 5 slides (Pro: 30)
```

#### Error Message (when exceeding limit)
```
❌ Upgrade Required
Slide limit exceeded. Free users can create up to 5 slides.
Upgrade to create up to 30 slides!
```

#### Success Message (within limit)
```
✅ 🎯 AI Outline Created!
5 slides intelligently structured with professional 
images and charts. Choose your style!
```

## Test with Different Slide Counts

| Slides | Free User | Premium User | Expected Result |
|--------|-----------|--------------|-----------------|
| 1      | ✅ Works  | ✅ Works     | Success         |
| 3      | ✅ Works  | ✅ Works     | Success         |
| 5      | ✅ Works  | ✅ Works     | Success         |
| 6      | ❌ Fails  | ✅ Works     | Free: Error, Premium: Success |
| 10     | ❌ Fails  | ✅ Works     | Free: Error, Premium: Success |
| 30     | ❌ Fails  | ✅ Works     | Free: Error, Premium: Success |
| 31     | ❌ Fails  | ❌ Fails     | Both: Error     |

## Browser Console Checks

### Open DevTools Console and Check:

1. **Network Tab** - Look for `/api/generate/presentation-outline` request
2. **Request Payload** should include:
   ```json
   {
     "prompt": "Your prompt",
     "pageCount": 5,
     "userId": "user-id-or-undefined"
   }
   ```

3. **Response** (success) should include:
   ```json
   {
     "outlines": [...],
     "maxSlides": 5,
     "isPremium": false
   }
   ```

4. **Response** (error) should include:
   ```json
   {
     "error": "Slide limit exceeded...",
     "maxAllowed": 5,
     "isPremium": false,
     "upgradeRequired": true
   }
   ```

## Database Verification (Optional)

### Check Subscription Status
```sql
-- Check if user has active subscription
SELECT * FROM subscriptions 
WHERE user_id = 'your-user-id' 
AND status = 'active';
```

### Create Test Premium User
```sql
-- Add test subscription
INSERT INTO subscriptions (
  user_id, 
  stripe_subscription_id, 
  stripe_price_id, 
  stripe_current_period_end, 
  status
) VALUES (
  'test-user-id',
  'sub_test123',
  'price_test123',
  '2025-12-31',
  'active'
);
```

## Troubleshooting

### Issue: Can create more than 5 slides
**Check:**
1. Is API receiving the request?
2. Is `userId` being passed?
3. Check browser console for errors
4. Verify API route is using updated code

### Issue: Always getting 403 error
**Check:**
1. Is `pageCount` correct in request?
2. Check API logs for validation errors
3. Verify subscription-utils.ts is imported correctly

### Issue: No error message shown
**Check:**
1. Frontend error handling in try-catch
2. Toast notifications working
3. Browser console for JavaScript errors

## Quick Fixes for Testing

### Temporarily Disable Limits (Dev Only)
```typescript
// In app/api/generate/presentation-outline/route.ts
// Comment out these lines:
/*
const validation = await validateSlideCount(pageCount, userId);
if (!validation.valid) {
  return NextResponse.json({ error: ... }, { status: 403 });
}
*/
```

### Force Premium Mode (Testing)
```typescript
// In components/presentation/presentation-generator.tsx
const isPro = true; // Change from false
```

### Increase Free Limit (Testing)
```typescript
// In lib/subscription-utils.ts
FREE: { MAX_SLIDES: 10 } // Change from 5
```

## Success Criteria

✅ Free users limited to 5 slides  
✅ Clear error messages when limit exceeded  
✅ UI shows correct limits  
✅ API enforces limits  
✅ No console errors  
✅ Smooth user experience  

## Test Completion Checklist

- [ ] Test 1: Within limit works
- [ ] Test 2: Exceeds limit shows error
- [ ] Test 3: API within limit works
- [ ] Test 4: API exceeds limit returns 403
- [ ] Test 5: UI caps input at 5
- [ ] Verified error messages are clear
- [ ] Verified success messages work
- [ ] No console errors
- [ ] UI badge shows correct limits
- [ ] Ready for production

## Next Steps After Testing

1. If all tests pass: ✅ Ready to deploy
2. If tests fail: Check troubleshooting section
3. When ready for premium: Follow `SUBSCRIPTION_LIMITS_IMPLEMENTATION.md`

## Quick Test Command

Run this to test everything at once:
```bash
# Test within limit
curl -X POST http://localhost:3000/api/generate/presentation-outline \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test", "pageCount": 5}' && echo "✅ Test 1 Passed"

# Test exceeds limit
curl -X POST http://localhost:3000/api/generate/presentation-outline \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test", "pageCount": 6}' && echo "❌ Test 2 Should Fail"
```

Good luck with testing! 🚀
