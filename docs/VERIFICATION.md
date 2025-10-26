# Verification Checklist

Run these steps to validate the app in a clean environment.

1) Install and quality checks
- npm ci
- npm run format:check
- npm run lint && npm run typecheck
- npm run test

2) Production build
- npm run build
- npm start (or deploy to your platform)

3) Manual verification
- Open the app and test critical flows
- Check /api/health returns { status: 'ok', ... }
- Check /sitemap.xml and /robots.txt

4) Audits
- Lighthouse (Performance, Accessibility, Best Practices, SEO)
- Axe DevTools for accessibility (WCAG 2.1 AA)

5) Cross-platform
- Test on Chrome, Firefox, Safari, Edge
- Test on iOS Safari and Android Chrome
- Verify responsive layouts across breakpoints
