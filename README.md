# Trade agency landing page template

A starting point for a small agency website aimed at trade businesses. It has an English landing page, a separate Dutch version in `dutch-site/`, and an enquiry flow you can connect to your own email and Redis accounts.

The copy is an example. The form uses a local mock by default, analytics is off, and search engines are blocked until you set a real `SITE_URL`. A successful build does not mean the site is ready to publish.

## Run it locally

Requires Node.js 20 or later and npm.

```bash
git clone https://github.com/59n/trade-agency-landing-page-template.git
cd trade-agency-landing-page-template
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. For Dutch, run these commands from `dutch-site/`; it has its own lockfile. Run one app at a time on port 3000, or use `npm run dev -- -p 3001` for the second app.

The mock form validates submissions but does **not** deliver email. Do not enter real customer data while testing a template.

## Make it yours

1. Edit `src/config/site.ts` for the name, area, services, team, FAQs and public email. Also review copy in the footer, contact section and process illustration. Make the equivalent edits under `dutch-site/` if you use it.
2. Review the generated social image in `src/app/opengraph-image.tsx`, the generated icon in `src/app/icon.tsx`, the static `src/app/favicon.ico` and the manifest in `src/app/manifest.ts`.
3. Rewrite `/privacy` to describe your actual organisation and data handling. The included page is a draft with prompts, not a legal notice ready to publish.
4. Put your real HTTPS origin in `SITE_URL`. Until then the app emits no canonical URL or sitemap entries and tells crawlers not to index it. `SITE_ORIGINS` is for additional trusted origins.
5. For live enquiries, verify a sender domain in Resend and set `RESEND_API_KEY`, `ENQUIRY_FROM_EMAIL`, `ENQUIRY_TO_EMAIL` and `ENQUIRY_DELIVERY_MODE=resend`. Set Upstash Redis credentials in `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. Production requests fail closed when delivery or storage is missing.
6. Use the [launch checklist](docs/LAUNCH_CHECKLIST.md) before publishing either version.

Keep credentials in `.env.local` or your host's secret settings. `.env.local` is ignored by Git. Variables beginning with `NEXT_PUBLIC_` are exposed to the browser, so never use that prefix for secrets.

## Optional analytics

Google Analytics 4 is off by default. To connect your own property, set `NEXT_PUBLIC_ANALYTICS_ENABLED=true` and `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...`. The Google tag loads only after a visitor opts in; an earlier analytics choice is not reused. The code sends page views and a small set of form and CTA events without form contents. Review your GA4 property settings, privacy notice and local consent requirements first. `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID` is an unused integration point, not an active conversion tag.

## Check your changes

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Run these separately in `dutch-site/` when changing that app. Tests use mock delivery and do not send email.

## Code map

- `src/config/site.ts`: business copy and placeholders
- `src/lib/enquiries/`: validation, delivery and Redis controls
- `src/components/enquiry-form.tsx`: form UI
- `src/lib/metadata.ts`, `src/app/robots.ts`, `src/app/sitemap.ts`: search metadata
- `src/components/analytics/`: optional Google Analytics consent and events

The existing visual layout is preserved. No client results, testimonials or business registrations are supplied.

## Publishing on GitHub

This repository starts with a clean template snapshot. If you fork it for a real business, review every public page and environment setting before publishing your own version.

## Licence

MIT. See [LICENSE](LICENSE). Replace the sample copy, branding and legal notice with material you have the right to publish.
