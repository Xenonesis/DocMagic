# Deployment Guide

This guide covers deploying Docverse to Vercel or Netlify.

## Prerequisites

- Node 18+
- Required environment variables set (see .env.example)

## Vercel

1. Import the repository in Vercel.
2. Set Environment Variables:
   - NEXT_PUBLIC_APP_URL
   - OPENROUTER_API_KEY or GEMINI_API_KEY
   - SUPABASE_URL, SUPABASE_ANON_KEY
   - STRIPE keys (if using Stripe): NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
3. Build Command: `npm run build`
4. Output: default for Next.js (Serverless/Edge as per Next routing)
5. Headers/CSP: handled via next.config.js

## Netlify

1. Create a new site from Git.
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Plugins: `@netlify/plugin-nextjs`
5. Set the same Environment Variables as Vercel.
6. Headers/CSP and CORS rules are preconfigured in netlify.toml.

## Post-deploy checks

- Health: visit /api/health (should return { status: 'ok', ... })
- SEO: visit /sitemap.xml and /robots.txt
- PWA: ensure manifest.json and offline.html are accessible
- Performance: run Lighthouse in Production and record results
