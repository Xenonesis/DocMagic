# Troubleshooting

## Common issues

- Build fails due to type errors: Next build ignores TS errors by config, but fix locally with `tsc --noEmit`.
- Missing env vars: Check .env.example and set required keys.
- CSP blocks resources: Inspect console CSP violations; add domains carefully.
- Supabase auth not working: Verify URL and Anon Key, and middleware cookies handling.
- Stripe failing: Ensure publishable and secret keys, webhook secret in prod.

## Local dev

- `npm run dev`
- `npm run lint` and `npm run test`

## Production

- Check /api/health endpoints if added
- Verify robots and sitemap generated
