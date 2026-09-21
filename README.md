# Bewertungsapp – Novak

Klasse: 4aAPC

## Setup
INFO: Ich arbeite in Linux Mint, kann sein das paar Sachen anders sind bei mir.
### Voraussetzungen / Techstack

* Node.js
* npm
* Git
* Docker
* Docker Compose
* Ionic CLI

## Projekt starten

### Alle drei Komponenten

```
cd ~/workspace/4LH/bewertungsapp-novak
```

Terminal 1:
```
docker compose up -d
```
Terminal 2:
```
cd backend
node index.js
```
Terminal 3:
```
cd frontend
ionic serve
```

## GitHub

Repository:

```text
https://github.com/melindanov/bewertungsapp-novak
```

Änderungen speichern und hochladen:

```bash
git add .
git commit -m "..."
git push
```

## Einheit 1: Installation

* [x] Screenshot Toolchain (`node --version`, `npm --version`, `ionic --version` bzw. laufende Docker-Container)
* [x] Screenshot des DB-Tools mit leerer Datenbank
* [x] Antworten auf die vier Verständnisfragen: `docs/screenshots/einheit1-fragen.md`

### Verständnisfragen

* [x] Was ist der Unterschied zwischen Capacitor und Cordova?
* [x] Was macht ein ORM wie Sequelize, und wofür braucht man zusätzlich die sequelize-cli?
* [x] Was unterscheidet `npm install` von `npx` beim Ausführen eines Pakets?
* [x] Was ist REST, und warum passt das Konzept zu einer Client-Server-Architektur wie Ionic-App und Node-Backend?

## Einheit 2: Datenmodell anlegen

* [ ] Ausgefüllte Planungsvorlage: `docs/diagramm/planungsvorlage.html`
* [ ] Verwendete `model:generate`-Befehle dokumentiert
* [ ] Screenshot der angelegten Tabellen im DB-Tool: `docs/screenshots/`

## Einheit 3: Assoziationen und weitere Modelle

* [ ] Alle Modelle (Team, Member, Project, Criterion, Juror, Evaluation) mit ausgefüllten `associate`-Methoden
* [ ] Unique-Constraint auf `(projectId, criterionId, jurorId)` bei Evaluation
* [ ] Mindestens ein Seeder mit Testdaten

## Einheit 4: Backend-Routen

* [ ] CRUD für Team und Project
* [ ] POST-Route für Evaluation inkl. Validierung
* [ ] Aggregations-Route: Durchschnitt der Punktzahl pro Projekt und Kriterium
* [ ] Kurze Endpunkt-Dokumentation

## Einheit 5: Postman-Test

* [ ] Collection: `docs/postman/bewertungsapp.postman_collection.json`
* [ ] Environment: `docs/postman/bewertungsapp.postman_environment.json`
* [ ] Mindestens zwei dokumentierte Negativtests
* [ ] Testbericht: `docs/postman/testbericht.md`

## Einheit 6: IONIC-Frontend

* [ ] Projektliste mit Team-Zuordnung
* [ ] Detailansicht eines Projekts mit bisherigen Bewertungen
* [ ] API-Service vollständig an eigenes Backend angebunden

## Einheit 7: Login und Endabgabe

* [ ] Bewertungsformular (Projekt, Kriterium, Punktzahl, Kommentar) mit Validierung
* [ ] Auswertungsseite mit Durchschnittswerten
* [ ] Juror-Login
* [ ] Token-Storage mit `@capacitor/preferences`
* [ ] Nachweis: geschützte Route liefert ohne Token 401
* [ ] Nachweis: geschützte Route liefert mit gültigem Token die erwartete Antwort

## Endpunkt-Dokumentation

| Methode | Pfad     | Body | Rückgabe          |
| ------- | -------- | ---- | ----------------- |
| GET     | `/teams` | –    | Liste aller Teams |

## Bekannte Einschränkungen

<hier eintragen, was noch fehlt oder bekannt fehlerhaft ist>
