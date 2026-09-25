export const site = {
  name: "Agency Name",
  legalName: "",
  companyNumber: "", // Voeg het KvK-nummer toe zodra dit beschikbaar is (bijv. "12345678")
  companyJurisdiction: "",
  registeredAddress: "",
  vatNumber: "", // Voeg het btw-nummer toe indien van toepassing (bijv. "NL123456789B01")
  locale: "nl-NL",
  regionFocus: "Nederland",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  phone: "",
  description:
    "Google Ads-beheer en tracking van telefoongesprekken en aanvragen voor Nederlandse vakbedrijven.",
  navigation: [
    { id: "services", href: "/#services", label: "Diensten" },
    { id: "approach", href: "/#approach", label: "Werkwijze" },
    { id: "about", href: "/#about", label: "Over ons" },
    { id: "contact", href: "/#contact", label: "Neem contact op" },
  ],
  headerCta: {
    label: "Neem contact op",
    href: "/#contact",
  },
  cta: {
    label: "Neem contact op",
    href: "/#contact",
  },
  hero: {
    eyebrow: "Google Ads voor Nederlandse vakbedrijven",
    heading: "Goed werk verdient het om gevonden te worden.",
    body: "Gericht Google Ads-beheer en heldere gesprekstracking voor vakbedrijven die meer passende opdrachten willen.",
    secondaryCta: {
      label: "Bekijk onze werkwijze",
      href: "/#approach",
    },
    searchExample: "Cv-ketel installeren Amsterdam",
  },
  servicesEyebrow: "Wat we doen",
  servicesHeading: "Duidelijk Google Ads-beheer en aanvraagtracking.",
  services: [
    {
      id: "google-ads",
      title: "Google Ads-beheer",
      summary:
        "Gerichte lokale zoekcampagnes die zich richten op de rendabele installatie- en renovatieklussen die je echt wilt.",
      deliverables: [
        "Lokale straal targeting en uitsluitingszoekwoorden om verspilling aan doe-het-zelfzoekopdrachten te voorkomen",
        "Duidelijke advertentieteksten die aansluiten op het vakwerk dat je aanbiedt, zonder overdreven claims",
        "Directe betaling: advertentiekosten betaal je altijd rechtstreeks aan Google",
      ],
    },
    {
      id: "call-tracking",
      title: "Gespreks- en aanvraagtracking",
      summary:
        "Koppel ieder telefoongesprek en formulier direct aan de advertentiecampagne die de aanvraag opleverde.",
      deliverables: [
        "Gesprekstracking waarmee je precies ziet welke advertentie de telefoon liet overgaan",
        "Bepaal en beoordeel je eigen criteria voor passende aanvragen",
        "Eenvoudige registratie van aanvraagresultaten, zodat je het echte rendement ziet",
      ],
    },
    {
      id: "performance-reviews",
      title: "Wekelijkse prestatiebesprekingen",
      summary:
        "Transparante wekelijkse evaluaties gericht op echte aanvragen en kosten per gesprek, niet op ijdele statistieken.",
      deliverables: [
        "Wekelijks overzicht van uitgaven, ontvangen gesprekken en offerteaanvragen",
        "Doorlopende opschoning van zoektermen die geen resultaat opleveren",
        "Een helder contact- en evaluatieproces",
      ],
    },
  ],
  approachEyebrow: "Onze werkwijze",
  approachHeading: "Heldere stappen. Gedeelde doelen.",
  approachIntro:
    "Een duidelijk proces, afgestemd op jouw vak en beschikbare capaciteit.",
  approach: [
    {
      title: "Je vak en capaciteit begrijpen",
      body: "We leren welke klussen rendabel zijn, welke je liever vermijdt en wat je werkgebied is.",
    },
    {
      title: "De campagne bouwen en starten",
      body: "We stellen zoekwoorden, uitsluitingen, advertentieteksten en gesprekstracking in. Advertentiekosten betaal je rechtstreeks aan Google.",
    },
    {
      title: "Gesprekken meten en budget aanscherpen",
      body: "We beoordelen iedere week echte gesprekken en aanvragen, beperken verspilling en schalen op wat werkt.",
    },
  ],
  aboutEyebrow: "Over ons",
  aboutHeading: "De mensen achter het werk.",
  aboutIntro:
    "Voeg hier een korte, feitelijke introductie van je team toe.",
  founders: [
    {
      name: "",
      role: "Technische uitvoering",
      bio: "Google Ads-campagnes opzetten, zoektermen filteren en gesprekken meten, met voortdurende aandacht voor prestaties.",
      photoSrc: "",
    },
    {
      name: "",
      role: "Bedrijfsontwikkeling",
      bio: "Je zakelijke doelen begrijpen, je op de hoogte houden en zorgen dat de telefoon overgaat voor de juiste opdrachten.",
      photoSrc: "",
    },
  ],
  faqs: [
    {
      question: "Heb ik een nieuwe website nodig?",
      answer:
        "Nee. Als je huidige website een werkend telefoonnummer en contactformulier heeft, sturen we bezoekers rechtstreeks naar die website. Onze focus ligt op Google Ads, niet op het verkopen van nieuwe websites.",
    },
    {
      question: "Zijn advertentiekosten inbegrepen in de bureaukosten?",
      answer:
        "Nee. Je betaalt de advertentiekosten met je eigen betaalmethode rechtstreeks aan Google. Onze beheervergoeding staat daar los van, wordt vooraf afgesproken en is volledig transparant.",
    },
    {
      question: "Hoe meten jullie resultaten?",
      answer:
        "We meten echte telefoongesprekken en formulieraanvragen uit de campagne. Verkeerde nummers van vijf seconden tellen we niet mee en we rapporteren geen ijdele statistieken zoals vertoningen zonder context.",
    },
    {
      question: "Werken jullie in heel Nederland?",
      answer:
        "Ja. We werken met Nederlandse vakbedrijven en stemmen campagnes af op het lokale werkgebied waarin jouw bedrijf actief is.",
    },
  ],
  contactHeading: "Neem contact op.",
  contactBody:
    "Heb je een algemene vraag, wil je advertentiebeheer bespreken of een gratis en eerlijke analyse van de lokale zoekvraag voor jouw vakgebied? Stuur ons hieronder een bericht.",
  formSubmitLabel: "Bericht versturen",
} as const

export type SiteConfig = typeof site
