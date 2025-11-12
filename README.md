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

## Fyll på med era reflektioner nedan!

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


### Tester
* Frontend

Projektet använder Jest tillsammans med React Testing Library för att testa komponenter och sidbeteenden i frontend.
Vi har valt dessa verktyg eftersom de är standard i React/Next.js-projekt och låter oss testa användarinteraktioner på ett sätt som liknar verklig användning.

#### Använda paket

- @testing-library/react – för att rendera komponenter och simulera användarinteraktioner

- @testing-library/jest-dom – för extra matchers som toBeInTheDocument() och toHaveValue()

- @testing-library/user-event – för att simulera användarhändelser som klick, input och formulärinmatning

- @jest-environment-jsdom – för att köra tester i en simulerad webbläsarmiljö (DOM)



### Github Actions
* Vi använde GitHub Actions för att automatisera delar av vårt arbetsflöde.
* Till exempel kördes linting och tester automatiskt vid varje pull request, så vi kunde upptäcka fel tidigt.
* Det hjälpte oss hålla koden ren och säkerställa att inget bröt projektet innan merge.

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