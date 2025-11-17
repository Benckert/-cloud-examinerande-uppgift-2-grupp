# Dagboken - Journal App

En minimalistisk dagboksapplikation byggd med Next.js, Express, MongoDB och Docker. Applikationen låter användare skapa, redigera och ta bort dagboksinlägg med humörsanalys via AI.

## Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** React 19
- **Testing:** Jest + React Testing Library

### Backend
- **Framework:** Express 5
- **Language:** TypeScript
- **Database:** MongoDB 6 with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod
- **AI Integration:** Google Gemini API
- **Testing:** Jest

### DevOps
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Deployment:** Render
- **Image Registry:** Docker Hub

## Getting Started

### Prerequisites

- Docker Desktop installed
- Node.js 22+ (for local development without Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/Benckert/-cloud-examinerande-uppgift-2-grupp.git
```

### 2. Environment Variables

Copy the `.env.example` file to `.env` and fill in your values:

```bash
cp .env.example .env
```

Then update the values in `.env`:

```env
# Backend
NODE_ENV=development
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb://mongo:27017/dagboken
GEMINI_API_KEY=your-gemini-api-key

# Frontend
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### 3. Run with Docker

```bash
docker-compose up
```

The application will be available at:
- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000
- **MongoDB:** localhost:27017

### 4. Run Locally (without Docker)

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests

### Frontend
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests

## API Endpoints

### Authentication
- `POST /api/users/signup` - Register new user
- `POST /api/users/login` - Login user

### Entries
- `GET /api/entries` - Get all entries for authenticated user
- `POST /api/entries` - Create new entry
- `PUT /api/entries/:id` - Update entry
- `DELETE /api/entries/:id` - Delete entry

### AI
- `POST /api/ai/analyze` - Analyze entry with AI

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── validation/      # Zod schemas
│   │   └── tests/           # Jest tests
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   ├── components/     # React components
│   │   ├── lib/            # API clients & utilities
│   │   └── tests/          # Jest tests
│   └── Dockerfile
└── docker-compose.yml
```

## Features

- ✅ User authentication with JWT
- ✅ Create, read, update, delete journal entries
- ✅ Mood tracking for each entry
- ✅ AI-powered analysis using Google Gemini
- ✅ Responsive design
- ✅ Containerized with Docker
- ✅ Automated testing with Jest
- ✅ CI/CD with GitHub Actions

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

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