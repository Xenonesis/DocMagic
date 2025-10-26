# QA Checklist

## Build & Quality

- [ ] `npm ci` on clean environment
- [ ] `npm run format:check` passes
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run test` passes
- [ ] `npm run build` finishes without blocking warnings
- [ ] CI workflow passes on PR and main

## SEO

- [ ] /sitemap.xml renders
- [ ] /robots.txt renders
- [ ] OpenGraph and Twitter cards present
- [ ] Canonical URLs correct

## Accessibility (WCAG 2.1 AA)

- [ ] All interactive elements have accessible names
- [ ] Color contrast meets AA
- [ ] Keyboard navigation covers all actions
- [ ] Focus states visible and logical
- [ ] Motion reduced with prefers-reduced-motion

## Performance (Core Web Vitals)

- [ ] LCP under target
- [ ] CLS minimal
- [ ] JS bundles split, no unused heavy deps
- [ ] Images optimized and lazy-loaded

## Security

- [ ] CSP allows required domains only
- [ ] HSTS enabled
- [ ] X-Frame-Options DENY
- [ ] Referrer-Policy strict-origin-when-cross-origin

## Cross-platform

- [ ] Chrome, Firefox, Safari, Edge tested
- [ ] Mobile Safari/Chrome tested
- [ ] Responsive layout across breakpoints
