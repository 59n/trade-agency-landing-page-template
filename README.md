# Trade Agency Landing Page Template

A configurable Next.js landing page template for small marketing agencies that serve trade businesses, with an English site and a separate Dutch version in `dutch-site/`.

The copy is an example. The enquiry form uses a local mock by default, analytics is off, and search engines are blocked until you set a real `SITE_URL`. A successful build does not mean the site is ready to publish.

## Features
- Single-page landing site driven by one config file (`src/config/site.ts`): name, area, services, team, FAQs and public email.
- Enquiry form with server-side validation, delivery through Resend, and rate limiting plus idempotency backed by Upstash Redis. Production requests fail closed when delivery or storage is missing.
- Mock delivery mode for local development and tests (never reports a simulated send as live).
- SEO metadata, `robots.txt`, sitemap, generated Open Graph image, icon and web manifest. No canonical URL or sitemap entries and `noindex` until `SITE_URL` is set.
- Optional Google Analytics 4 that loads only after visitor opt-in and sends page views plus a small set of form and CTA events (no form contents).
- Draft privacy page with prompts for your own organisation.
- Dutch version as a separate app with its own lockfile.

## Tech stack
- Next.js 16, React 19, TypeScript
- Tailwind CSS 4, shadcn / Base UI, Lucide icons, Motion
- Resend (email), Upstash Redis and `@upstash/ratelimit`
- `tsx --test` for unit tests, ESLint

## Getting started

### Prerequisites
- Node.js 20 or later and npm

### Install and run
```bash
git clone https://github.com/59n/trade-agency-landing-page-template.git
cd trade-agency-landing-page-template
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. For Dutch, run the same commands from `dutch-site/`. Run one app at a time on port 3000, or use `npm run dev -- -p 3001` for the second.

The mock form validates submissions but does not deliver email. Do not enter real customer data while testing.

### Configuration
Environment variables (see `.env.example`):

- `SITE_URL`: public HTTPS origin, used for origin checks, canonical URLs and the sitemap
- `SITE_ORIGINS`: optional extra trusted origins, comma-separated
- `ENQUIRY_DELIVERY_MODE`: `resend` or `mock` (development defaults to mock; production must use resend)
- `RESEND_API_KEY`, `ENQUIRY_FROM_EMAIL` (alias `RESEND_FROM_EMAIL`), `ENQUIRY_TO_EMAIL`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`: required in production
- `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_SECONDS`
- `TRUST_PROXY`: set `true` only on a platform that overwrites forwarded-for (Vercel is detected automatically)
- `NEXT_PUBLIC_CONTACT_EMAIL`: optional footer email
- `NEXT_PUBLIC_ANALYTICS_ENABLED`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`: optional GA4
- `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID`: unused integration point, not an active conversion tag

Keep credentials in `.env.local` (ignored by Git) or your host's secret settings. `NEXT_PUBLIC_` variables are exposed to the browser, so never use that prefix for secrets.

### Make it yours
1. Edit `src/config/site.ts`, and review copy in the footer, contact section and process illustration. Make the same edits under `dutch-site/` if you use it.
2. Review `src/app/opengraph-image.tsx`, `src/app/icon.tsx`, `src/app/favicon.ico` and `src/app/manifest.ts`.
3. Rewrite `/privacy` to describe your actual organisation and data handling. The included page is a draft, not a legal notice.
4. Set `SITE_URL` to your real HTTPS origin.
5. For live enquiries, verify a sender domain in Resend, set the Resend and Upstash variables and `ENQUIRY_DELIVERY_MODE=resend`.
6. For analytics, set `NEXT_PUBLIC_ANALYTICS_ENABLED=true` and `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...`, and review your GA4 settings, privacy notice and consent requirements first.
7. Work through the [launch checklist](docs/LAUNCH_CHECKLIST.md) before publishing either version.

If you fork it for a real business, review every public page and environment setting before publishing. No client results, testimonials or business registrations are supplied.

### Checks
```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Run these separately in `dutch-site/` when changing that app. Tests use mock delivery and do not send email.

## Project structure
```
src/config/site.ts               Business copy and placeholders
src/app/                         Pages, privacy notice, robots, sitemap, OG image, icon, manifest, API route
src/components/enquiry-form.tsx  Enquiry form UI
src/components/sections/         Landing page sections
src/components/analytics/        Optional GA4 consent and events
src/lib/enquiries/               Validation, delivery and Redis controls
src/lib/metadata.ts              Search metadata
dutch-site/                      Dutch version (separate Next.js app)
docs/LAUNCH_CHECKLIST.md         Pre-launch checklist
```

## Status
Template; stable, last updated September 2026.

## License
MIT, see [LICENSE](LICENSE). Replace the sample copy, branding and legal notice with material you have the right to publish.
