# Before publishing

Do this for each app you deploy. The root and `dutch-site/` have separate configuration and builds.

- [ ] Replace “Agency Name”, generic copy, service area, team roles, illustrative campaign text, social image and favicon. Remove offers and promises you cannot support.
- [ ] Set a real HTTPS `SITE_URL`. Inspect the rendered title, canonical, robots.txt, sitemap.xml and social preview on the deployed host.
- [ ] Rewrite `/privacy` for your real controller, providers, lawful basis, retention, transfers and visitor rights. Obtain appropriate review.
- [ ] Configure a verified Resend sender, recipient and Upstash Redis. Set `ENQUIRY_DELIVERY_MODE=resend`; keep keys server-side. Set `TRUST_PROXY=true` only if your host overwrites forwarded IP headers.
- [ ] With permission, submit one end-to-end enquiry and check receipt, reply-to, error handling, rate limiting and duplicate protection.
- [ ] If using analytics, provide your own GA4 measurement ID, check that consent gates the Google tag and update the privacy notice. Otherwise leave tracking off.
- [ ] Run `npm ci`, `npm run typecheck`, `npm run lint`, `npm test` and `npm run build`. Check mobile layout, keyboard access and the form in a browser.
- [ ] Check the repository settings and commit history before enabling public access. A removed secret can remain in history.
