# Registration 500 Error - Troubleshooting Guide

## Problem
The registration endpoint `/api/auth/register` is returning a 500 Internal Server Error when users try to create an account.

## Changes Made

### 1. Enhanced Error Logging
Added comprehensive logging throughout the registration flow in `app/api/auth/register/route.ts`:
- Request body validation
- Input sanitization
- Supabase client creation
- User signup process
- Detailed error information including stack traces in development mode

### 2. Environment Variable Validation
Added checks in both:
- `app/api/auth/register/route.ts` - Validates before processing
- `lib/supabase/server.ts` - Validates before creating Supabase clients

### 3. Fixed TypeScript Errors
Removed generic type parameters from Supabase client creation functions that were causing compilation issues.

## Most Likely Causes

### 1. Missing Environment Variables ⚠️ **MOST COMMON**
The server needs these environment variables in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

**How to fix:**
1. Copy `.env.local.example` to `.env.local`
2. Get your Supabase credentials from: https://app.supabase.com/project/_/settings/api
3. Fill in the values
4. Restart your development server

### 2. Supabase Project Not Set Up
Your Supabase project might not have the necessary authentication configuration.

**How to fix:**
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Settings
3. Ensure "Enable email confirmations" is configured according to your needs
4. Check that "Enable email provider" is turned on

### 3. Database Schema Issues
The users table or auth schema might not be properly configured.

**How to fix:**
Run the database setup script:
```bash
npm run setup-db
```

## Debugging Steps

### Step 1: Check the Server Console
After making the changes, restart your dev server and try registering again. Look for these log messages:

```
[Registration] Starting registration process
[Registration] Received request body
[Registration] Input validated successfully
[Registration] Inputs sanitized
[Registration] Creating Supabase client
[Registration] Supabase client created successfully
[Registration] Attempting to sign up user
```

If the logs stop at a certain point, that's where the error is occurring.

### Step 2: Check Environment Variables
Run this command to verify your environment variables are loaded:

```bash
# In PowerShell
$env:NEXT_PUBLIC_SUPABASE_URL
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY
```

If these return empty, your `.env.local` file is not being loaded.

### Step 3: Check Browser Console
The error response now includes more details in development mode. Check the browser console for the full error message and stack trace.

### Step 4: Verify Supabase Connection
Test your Supabase connection by creating a simple test endpoint:

```typescript
// app/api/test-supabase/route.ts
import { createRoute } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createRoute();
    const { data, error } = await supabase.auth.getSession();
    
    return Response.json({ 
      success: true, 
      hasSession: !!data.session,
      error: error?.message 
    });
  } catch (error: any) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
```

Visit `http://localhost:3000/api/test-supabase` to test the connection.

## Next Steps

1. **Restart your development server** to apply the changes:
   ```bash
   npm run dev
   ```

2. **Try registering again** and check the server console for detailed logs

3. **Check the browser console** for the error response with stack trace (in development mode)

4. **Verify your `.env.local` file** has all required Supabase credentials

5. **If the error persists**, share the console logs from both the server and browser for further debugging

## Common Error Messages

### "Missing Supabase environment variables"
- **Cause**: `.env.local` file is missing or doesn't have the required variables
- **Fix**: Create `.env.local` and add your Supabase credentials

### "Error creating route handler client"
- **Cause**: Issue with cookie handling or Supabase client initialization
- **Fix**: Ensure you're using the latest version of `@supabase/auth-helpers-nextjs`

### "Validation failed"
- **Cause**: Input validation is failing (name, email, or password format)
- **Fix**: Check that the password meets requirements (8+ chars, uppercase, lowercase, number)

### "User already registered"
- **Cause**: Email is already in use
- **Fix**: Use a different email or sign in with existing account

## Additional Resources

- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Authentication Flow Documentation](./AUTHENTICATION_FLOW.md)
- [Environment Variables Example](./.env.local.example)
