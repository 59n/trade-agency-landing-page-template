# Project status

## State

This repository is a reusable template with English and Dutch Next.js apps. Both are demonstrations until customised; the enquiry form uses mock delivery locally and production requests fail closed without provider configuration.

## Verified

- The public GitHub repository is `59n/trade-agency-landing-page-template`, marked as a template.
- Optional Google Analytics 4 replaces the previous analytics integration. It requires an explicit measurement ID and visitor consent; the previous consent key is not reused. Browser checks confirmed one page view after opt-in and no tag load before consent.

- The English root and `dutch-site/` each passed `npm run typecheck`, `npm run lint`, 26 tests and `npm run build` with `SITE_URL=` and analytics disabled.
- An English production server smoke check returned HTTP 200 for `/`, `/privacy`, `/robots.txt`, `/sitemap.xml` and `/opengraph-image`. Unconfigured robots disallowed crawling.
- No real email was sent.

## Customisation needed

Replace example business copy and assets, complete and review the privacy notice, set your real HTTPS `SITE_URL`, and configure verified email delivery and Redis. Follow [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md).

## Resume here

1. Inspect `src/config/site.ts`, `src/lib/enquiries/env.ts`, `src/lib/metadata.ts` and the corresponding Dutch files.
2. Run `npm run typecheck`, `npm run lint`, `npm test` and `npm run build` in each app after changes.
3. Keep `.env.local`, `.agents/` and `.gemini/` out of Git.
4. Last updated: 2026-09-26 UTC.
