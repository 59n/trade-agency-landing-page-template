# Nederlandse versie

Deze map is een zelfstandige Nederlandse versie van de [agency-template](../README.md). Gebruik het eigen `package-lock.json` en de eigen configuratie.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Het formulier gebruikt standaard een mock en verstuurt geen e-mail. Analytics staat uit. Zonder echte `SITE_URL` wordt de site niet geïndexeerd.

Pas `src/config/site.ts`, de overige zichtbare teksten, afbeeldingen en `src/app/privacy/page.tsx` aan voordat je publiceert. Voor echte aanvragen zijn een geverifieerde Resend-afzender, een ontvanger en Upstash Redis nodig. De variabelen staan in `.env.example`; de stappen staan in de [launch checklist](../docs/LAUNCH_CHECKLIST.md).

```bash
npm run typecheck
npm run lint
npm test
npm run build
```
