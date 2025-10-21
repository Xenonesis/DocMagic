# Quick Fix for Registration Error

## The Problem
Your registration is failing with a 500 error because **Supabase environment variables are missing**.

## The Solution (3 Steps)

### Step 1: Create `.env.local` file

Create a new file called `.env.local` in the root of your project with this content:

```env
# SUPABASE CONFIGURATION (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# APP CONFIGURATION
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# GEMINI AI (REQUIRED for document generation)
GEMINI_API_KEY=your-gemini-api-key-here

# OTHER (Optional)
NEXTAUTH_SECRET=your-secret-here
```

### Step 2: Get Your Supabase Credentials

1. Go to https://app.supabase.com
2. Select your project (or create one if you don't have it)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Verify It Works

After restarting, try registering again. You should see these logs in your terminal:

```
[Registration] Starting registration process
[Registration] Received request body
[Registration] Input validated successfully
[Registration] Inputs sanitized
[Registration] Creating Supabase client
[Registration] Supabase client created successfully
[Registration] Attempting to sign up user
```

## Still Not Working?

If you still see errors, check:

1. **Environment variables are loaded**: The server console should NOT show "Missing Supabase environment variables"

2. **Supabase project is set up**: 
   - Go to your Supabase dashboard
   - Navigate to **Authentication** → **Providers**
   - Make sure **Email** provider is enabled

3. **Check the server logs**: Look for the exact error message in the terminal where `npm run dev` is running

## Need Help?

Share the error logs from your terminal (where you ran `npm run dev`) for more specific help.
