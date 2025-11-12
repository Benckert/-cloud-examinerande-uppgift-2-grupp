### Github projects & issues -Andréa
* Kanban board på github projects med issues som vi regelbundet gick igenom och delegerade mellan oss. 
* Vi skapade issues för varje uppgift eller bugg
* Alla issues hade labels (t.ex. frontend, backend, bug) och assignades till en person i gruppen
* Vi flyttade issues mellan kolumner som Backlog, Ready, In progress, Review och Done.
* Vi gick regelbundet igenom boarden på våra möten – det hjälpte oss att se statusen i projektet och fördela arbetet jämt.

### Pull requests -Andréa
* Vi satte regler att man inte kunde push direkt till main
    - Alltid ny branch och pull requests som krävde minst en review innan man kunde merge.
* Vi gick ofta igenom pull requests tillsammans så alla fick inblick i varandras delar av projektet

### Branching strategy -Andrea
* Brancher för varje task med tydliga namn
    * ex. 'Docker workflow' eller 'feature/signin' mm.
* Vi försökte hålla brancherna små och fokuserade, vilket gjorde det lättare att hitta buggar och hålla historiken ren.

### Commit historik -Hanna
* Vi skrev koncisa och beskrivande commit-meddelanden, t.ex "added delete function to entry", "added tags-mood on entrycard for display and changed to current timezone"
* Det gjorde det lättare att följa projektets utveckling i efterhand.
* “Vi tänkte på att skriva commitmeddelanden som förklarar vad och ibland varför vi gjort något – inte bara ‘fix’.”

### Tester - Hanna
- Vi använde Jest tillsammans med React Testing Library för att testa komponenter och sidbeteenden i frontend.
- För backend används enbart Jest för att testa Express-controllers i isolering.
- Syftet med testerna är att säkerställa att applikationens kärnfunktioner fungerar som förväntat, utan att vara beroende av verkliga API-anrop eller databaser, därför använde vi mockdata i våra tester. 

### Docker -Kristoffer

### Github Actions -Kristoffer
* Vi använde GitHub Actions för att automatisera delar av vårt arbetsflöde.
* Till exempel kördes linting och tester automatiskt vid varje pull request, så vi kunde upptäcka fel tidigt.
* Det hjälpte oss hålla koden ren och säkerställa att inget bröt projektet innan merge.

### Vad vi ändrade -Sara
* Bröt ut backend till Express + MongoDB / Mongoose
    * CRUD + Autentisering med JWT
* Kunna ta bort och redigera inlägg 
* Förmedla humör på varje inlägg
* AI analys av inlägg och humör med positiv feedback
    * Gemini

### Kommunikation -Sara
* Discord 
    * Regelbundna uppdateringar angående vad man jobbat på under dagen när vi haft individuellt arbete av uppgifter.
    * Bestämma framtida möten 
* Stand-up möten nästan varje dag
    * Vad har vi hunnit göra
    * Gå igenom pull requests och merge
    * Delegera nya uppgifter
* Mobbprogrammering med Live Share

### AI -Sara
* Vi använde AI som en lärare när vi behövde hjälp att komma igång och när vi inte förstod något. 
* Mycket av koden är AI genererad där vi samtidigt försökt förstå vad koden gör medans vi implementwrade den. 

### Reflektion

* Fördelar med CI/CD Pipeline & varför det är viktigt i sjösättning av projekt. 

- Tidigare felupptäckt - Buggar fångas redan vid pull request, inte efter release.
- Stabilitet - Samma byggprocess körs varje gång – inga “it works on my machine problem.
- Kvalitetssäkring - All kod testas automatiskt innan den når produktion.
- Team-samarbete - PR-granskning + tester = tryggare merge-flöde.
- Snabbare leverans - Ingen manuell deploy krävs – varje merge är potentiell release. 
