# Google OAuth Fix Guide

## ✅ Code Fix Applied

The authentication callback route has been fixed to use server-side Supabase client with proper cookie handling. This was the primary code issue.

## 🔧 Supabase Configuration Required

For Google OAuth to work, you **MUST** configure the redirect URLs in your Supabase project:

### Step 1: Add Redirect URLs in Supabase Dashboard

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `dheiucdatrgrkozkssrp`
3. Navigate to: **Authentication** → **URL Configuration**
4. Add these URLs to **Redirect URLs** (Site URL section):

   ```
   http://localhost:3000/auth/callback
   http://localhost:3002/auth/callback
   http://localhost:3003/auth/callback
   ```

   **Note:** Add multiple localhost ports to handle different dev server ports.

5. Also add your production URLs when deploying:
   ```
   https://your-domain.com/auth/callback
   https://your-domain.vercel.app/auth/callback
   https://your-domain.netlify.app/auth/callback
   ```

### Step 2: Configure Google OAuth Provider

1. In Supabase Dashboard, go to: **Authentication** → **Providers**
2. Find **Google** and click to configure
3. Enable the Google provider
4. You should already have:
   - **Client ID**: `431338067891-8988p76ieg1mh2memp2gqiocfeh1i84l.apps.googleusercontent.com`
   - **Client Secret**: (your secret)

5. Make sure the provider is **Enabled**

### Step 3: Verify Google Cloud Console Settings

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID
3. Under **Authorized redirect URIs**, ensure you have:
   ```
   https://dheiucdatrgrkozkssrp.supabase.co/auth/v1/callback
   ```

## 🧪 Testing the Fix

### Option 1: Use Port 3000 (Recommended)
Stop the current dev server and restart on port 3000:

```bash
# Stop current server (Ctrl+C)
# Kill process on port 3000
npx kill-port 3000

# Start dev server
npm run dev
```

### Option 2: Update Environment Variable
If you want to use port 3002, create a `.env.local` file:

```bash
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

Then restart the dev server.

## 🔍 Debugging Steps

If Google OAuth still doesn't work after configuration:

### 1. Check Browser Console
Open browser DevTools (F12) and check for errors when clicking "Continue with Google"

### 2. Check Server Logs
Look at the terminal running `npm run dev` for any errors

### 3. Verify Redirect URL
After clicking Google sign-in, check the URL you're redirected to. It should be:
```
https://accounts.google.com/...
```

If you see an error about redirect_uri_mismatch, the Supabase redirect URLs are not configured correctly.

### 4. Check Callback Route
After Google authentication, you should be redirected to:
```
http://localhost:3002/auth/callback?code=...
```

Check the server logs for any errors in the callback route.

### 5. Common Errors

**Error: "redirect_uri_mismatch"**
- Solution: Add the redirect URL to Supabase Dashboard → Authentication → URL Configuration

**Error: "Invalid redirect URL"**
- Solution: Ensure the URL in Supabase matches exactly (including http/https and port)

**Error: "Session not found"**
- Solution: This was the bug we fixed - the callback route now properly handles cookies

**Error: "Multiple GoTrueClient instances"**
- This is just a warning and won't prevent OAuth from working

## 📝 Summary of Changes Made

### File: `app/auth/callback/route.ts`

**Before (Broken):**
```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
```

**After (Fixed):**
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const cookieStore = cookies();
const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // Handle cookie setting errors
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch (error) {
          // Handle cookie removal errors
        }
      },
    },
  }
);
```

## ✨ What This Fix Does

1. **Server-Side Client**: Uses `createServerClient` from `@supabase/ssr` instead of client-side client
2. **Cookie Handling**: Properly manages cookies for session persistence
3. **OAuth Flow**: Correctly exchanges authorization code for session tokens
4. **Session Storage**: Stores authentication session in secure HTTP-only cookies

## 🚀 Next Steps

1. **Configure Supabase redirect URLs** (most important!)
2. **Restart dev server** on port 3000 or update environment variable
3. **Test Google OAuth** by clicking "Continue with Google"
4. **Verify successful login** - you should be redirected back and signed in

If you still encounter issues after following these steps, please share:
- Browser console errors
- Server terminal logs
- The exact error message you see
