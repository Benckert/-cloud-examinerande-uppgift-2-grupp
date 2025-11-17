# Journal App - Student Assignment Starter

A minimalist journaling application built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. This project serves as a starting point for students to practice debugging, adding features, and improving existing code.


## Tech Stack

- **Frontend Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend/Database:** Supabase (Authentication + PostgreSQL)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd dagboks-appen
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Skapa nytt projekt på supabase
2. Kör allt som finns i `supabase/schema.sql` i SQL-editorn
3. Hitta API-nycklar på Supabase och ersätt i .env.example

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Design Philosophy

This app follows a minimalist, editorial design approach:

- **Typography:** Serif fonts for headings, sans-serif for body text
- **Color Palette:** Cream backgrounds with dark brown text and warm gray accents
- **Spacing:** Generous whitespace for readability
- **Layout:** Clean, centered layouts with maximum content width
- **Interaction:** Subtle hover states and transitions


## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

# Grupp 7 
## Andréa, Hanna, Kristoffer B, Sara

### Branching strategy
* Brancher för varje task med tydliga namn
    * ex. 'Docker worflow' eller 'feature/signin' mm.
* Vi försökte hålla brancherna små och fokuserade, vilket gjorde det lättare att hitta buggar och hålla historiken ren.

### Pull requests
* Vi satte regler att man inte kunde push direkt till main
    - Alltid ny branch och pull requests som krävde minst en review innan man kunde merge.
* Vi gick ofta igenom pull requests tillsammans så alla fick inblick i varandras delar av projektet

### Commit historik
* Vi skrev koncisa och beskrivande commit-meddelanden, t.ex. ‘Add responsive styles for entries page’ eller ‘Fix bug in signup form validation’.
* Det gjorde det lättare att följa projektets utveckling i efterhand.
* “Vi tänkte på att skriva commitmeddelanden som förklarar vad och ibland varför vi gjort något – inte bara ‘fix’.”

### Github projects & issues
* Kanban board på github projects med issues som vi regelbundet gick igenom och delegerade mellan oss. 
* Vi skapade issues för varje uppgift eller bugg
* Alla issues hade labels (t.ex. frontend, backend, bug) och assignades till en person i gruppen
* Vi flyttade issues mellan kolumner som Backlog, Ready, In progress, Review och Done.
* Vi gick regelbundet igenom boarden på våra möten – det hjälpte oss att se statusen i projektet och fördela arbetet jämt.

### Docker

Vi har en container med tre images som arbetar tillsammans genom Docker Compose. Frontend kör vår Next.js-applikation, backend kör Express-servern med vårt API, och MongoDB tillhandahåller databasen som backend använder för att spara användare och inlägg.

Våra Dockerfiler är uppbyggda i flera steg för att optimera både utveckling och produktion. Frontend-Dockerfilen börjar med att kopiera in package.json och installera alla dependencies. Sedan kopieras resten av koden och Next.js bygger en produktionsversion av applikationen. Till sist använder vi en minimal Node.js-image för att köra den färdiga appen, vilket håller nere storleken på containern. Vi kör även Next.js i standalone-läge som är optimerat för docker, även detta bidrar till en mindre image. Backend-Dockerfilen följer ett liknande mönster, den installerar dependencies och kopierar in all backend-kod.

Docker Compose-filen fastställer hur allt körs tillsammans. Den definierar hur våra tre images ska startas, vilka portar som ska exponeras och hur de kan kommunicera med varandra genom ett gemensamt nätverk. Backend kan till exempel nå MongoDB via det interna nätverket istället för localhost, och miljövariabler som databas-URL:er injiceras automatiskt.

Detta har varit användbart både vid lokal utveckling och även vid deployment av projektet till produktion, eftersom samma container kan köras både lokalt och på en server vid deplyoment.

### Tester

Projektet använder Jest tillsammans med React Testing Library för att testa komponenter och sidbeteenden i frontend.
Vi har valt dessa verktyg eftersom de är standard i React/Next.js-projekt och låter oss testa användarinteraktioner på ett sätt som liknar verklig användning.
Syftet med testerna är att säkerställa att applikationens kärnfunktioner fungerar som förväntat, utan att vara beroende av verkliga API-anrop eller databaser.
För backend används enbart Jest för att testa Express-controllers i isolering.

#### Använda paket

- @testing-library/react – för att rendera komponenter och simulera användarinteraktioner

- @testing-library/jest-dom – för extra matchers som toBeInTheDocument() och toHaveValue()

- @testing-library/user-event – för att simulera användarhändelser som klick, input och formulärinmatning

- @jest-environment-jsdom – för att köra tester i en simulerad webbläsarmiljö (DOM)

- @jest – för att köra tester och mocka Mongoose-modeller

### Github Actions
* Vi använde GitHub Actions för att automatisera delar av vårt arbetsflöde.
* Vid en pull-request körs lintning och testning av docker, detta förhindrar att en icke fungerande applikation mergas in till main
* Vid push till main (merge efter godkänd pull-request) byggs docker images för front och backend som sedan pushas upp till Dockerhub, efter det hämtar Render hem de senaste imagesen med hjälp av en webhook och deployar automatiskt den senaste versionen.
* Det hjälpte oss hålla koden ren och säkerställa att inget bröt projektet innan merge och deployment.

### Vad vi ändrade
* Bröt ut backend till Express + MongoDB / Mongoose
    * CRUD + Autentisering med JWT
* Kunna ta bort och redigera inlägg 
* Förmedla humör på varje inlägg
* AI analys av inlägg och humör med positiv feedback
    * Gemini

### Kommunikation
* Discord 
    * Regelbundna uppdateringar angående vad man jobbat på under dagen när vi haft individuellt arbete av uppgifter.
    * Gått igenom PR och Github projects på distans
    * Bestämma framtida möten 
* Mobbprogrammering med Live Share

### AI
* Vi använde AI som en lärare när vi behövde hjälp att komma igång och när vi inte förstod något. 