# Maintenance Guide

## Regular tasks

- Update dependencies monthly (use `npm outdated`, then `npm update` or renovate)
- Review CSP domains in next.config.js and netlify.toml when adding integrations
- Rotate API keys and secrets every 90 days
- Monitor error logs and performance metrics

## Supabase

- Keep migrations in `supabase/migrations` in sync
- Run `supabase db reset` in dev when needed

## AI Providers

- Verify `AI_PROVIDER` and API keys are set correctly in production

## Security

- Review headers and CSP changes after feature additions
- Ensure HTTPS is enforced via HSTS and canonical URLs

## Backups

- Backup environment variables and Stripe/Supabase settings
