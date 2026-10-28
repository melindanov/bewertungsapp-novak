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

git tag lab2
git push origin lab2
```

```bash
git status
git tag
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

* [x] Ausgefüllte Planungsvorlage: `docs/diagramm/planungsvorlage.html`
* [x] Verwendete `model:generate`-Befehle dokumentiert
* [x] Screenshot der angelegten Tabellen im DB-Tool: `docs/screenshots/`

## Einheit 3: Assoziationen und weitere Modelle

* [x] Alle Modelle (Team, Member, Project, Criterion, Juror, Evaluation) mit ausgefüllten `associate`-Methoden
* [x] Unique-Constraint auf `(projectId, criterionId, jurorId)` bei Evaluation
* [x] Mindestens ein Seeder mit Testdaten

## Einheit 4: Backend-Routen

* [x] CRUD für Team und Project
* [x] POST-Route für Evaluation inkl. Validierung
* [x] Aggregations-Route: Durchschnitt der Punktzahl pro Projekt und Kriterium
* [x] Kurze Endpunkt-Dokumentation
* Postman-Testfälle: `docs/einheit4-postman.md`

# Backend API – Bewertungsapp

## Aufbau
- `index.js`: Router und Fehlerbehandlung
- `routes/helpers.js`: Validierung
- `routes/teams.js`: Teams
- `routes/projects.js`: Projekte
- `routes/evaluations.js`: Bewertungen und Statistiken

Screenshots: `docs/screenshots/`

## API-Endpunkte

### Teams (`/teams`)
| Methode | Pfad | Funktion |
|---|---|---|
| GET | `/teams` | Alle Teams anzeigen |
| GET | `/teams/:id` | Ein Team anzeigen |
| POST | `/teams` | Team erstellen |
| PUT | `/teams/:id` | Team ändern |
| DELETE | `/teams/:id` | Team löschen |

Pflichtfelder: `name`, `klasse`

### Projects (`/projects`)
| Methode | Pfad | Funktion |
|---|---|---|
| GET | `/projects` | Alle Projekte anzeigen |
| GET | `/projects/:id` | Ein Projekt anzeigen |
| POST | `/projects` | Projekt erstellen |
| PUT | `/projects/:id` | Projekt ändern |
| DELETE | `/projects/:id` | Projekt löschen |

Pflichtfelder: `teamId`, `titel`, `beschreibung`, `praesentiertAm`

### Evaluations (`/evaluations`)
| Methode | Pfad | Funktion |
|---|---|---|
| POST | `/evaluations` | Bewertung erstellen |
| GET | `/evaluations/statistics` | Durchschnittliche Bewertungen anzeigen |

Pflichtfelder: `projectId`, `criterionId`, `jurorId`, `score`, `comment`

**Validierung:**
- IDs müssen gültig sein und Datensätze existieren.
- `score` muss zwischen 0 und dem maximalen Wert des Kriteriums liegen.
- `comment` darf nicht leer sein.
- Doppelte Bewertungen sind nicht erlaubt.

## HTTP-Statuscodes

| Code | Bedeutung |
|---|---|
| 200 | Erfolgreich |
| 201 | Datensatz erstellt |
| 204 | Erfolgreich gelöscht |
| 400 | Ungültige Eingabe |
| 404 | Datensatz oder Route nicht gefunden |
| 409 | Konflikt, z. B. doppelte Bewertung |
| 500 | Serverfehler |

Fehler werden als JSON zurückgegeben, z. B.:

```json
{ "error": "Team nicht gefunden" }
```

## Statistiken
Die Bewertungen werden mit `AVG(score)` pro Projekt und Kriterium berechnet. `COUNT(id)` zählt die Bewertungen. Der Durchschnitt wird als Zahl zurückgegeben.

## ~~Einheit 5: Postman-Test~~

* [ ] Collection: `docs/postman/bewertungsapp.postman_collection.json`
* [ ] Environment: `docs/postman/bewertungsapp.postman_environment.json`
* [ ] Mindestens zwei dokumentierte Negativtests
* [ ] Testbericht: `docs/postman/testbericht.md`

## Einheit 6: IONIC-Frontend

* [x] Projektliste mit Team-Zuordnung
* [x] Detailansicht eines Projekts mit bisherigen Bewertungen
* [x] API-Service vollständig an eigenes Backend angebunden

Voraussetzungen: Backend läuft (`docker compose up -d`, `cd backend && node index.js`).

```bash
cd frontend
npm install   # nur beim ersten Mal
ionic serve   # http://localhost:8100
```

API-URL: `http://localhost:3000` (`frontend/src/environments/environment.ts`)

* `/home` – Projektliste mit Team
* `/projects/:id` – Projektdetail mit Team und Bewertungen (Kriterium, Punkte, Kommentar)
* `frontend/src/app/services/api.service.ts` – `GET /projects`, `GET /projects/:id`

Screenshots (`docs/screenshots/`):

## Einheit 7: Login und Endabgabe

* [ ] Bewertungsformular (Projekt, Kriterium, Punktzahl, Kommentar) mit Validierung
* [ ] Auswertungsseite mit Durchschnittswerten
* [ ] Juror-Login
* [ ] Token-Storage mit `@capacitor/preferences`
* [ ] Nachweis: geschützte Route liefert ohne Token 401
* [ ] Nachweis: geschützte Route liefert mit gültigem Token die erwartete Antwort

## Endpunkt-Dokumentation

| Methode | Pfad                      | Body                                                   | Rückgabe                              |
| ------- | ------------------------- | ------------------------------------------------------ | ------------------------------------- |
| GET     | `/teams`                  | –                                                      | Liste aller Teams                     |
| GET     | `/teams/:id`              | –                                                      | ein Team inkl. Members und Projects   |
| POST    | `/teams`                  | `name`, `klasse`                                       | angelegtes Team (201)                 |
| PUT     | `/teams/:id`              | `name`, `klasse`                                       | geändertes Team                       |
| DELETE  | `/teams/:id`              | –                                                      | 204 ohne Body                         |
| GET     | `/projects`               | –                                                      | Liste aller Projekte inkl. Team       |
| GET     | `/projects/:id`           | –                                                      | ein Projekt inkl. Team und Evaluations |
| POST    | `/projects`               | `teamId`, `titel`, `beschreibung`, `praesentiertAm`    | angelegtes Projekt (201)              |
| PUT     | `/projects/:id`           | `teamId`, `titel`, `beschreibung`, `praesentiertAm`    | geändertes Projekt                    |
| DELETE  | `/projects/:id`           | –                                                      | 204 ohne Body                         |
| POST    | `/evaluations`            | `projectId`, `criterionId`, `jurorId`, `score`, `comment` | angelegte Bewertung (201)          |
| GET     | `/evaluations/statistics` | –                                                      | Durchschnitt pro Projekt und Kriterium |

Details und Fehlercodes: siehe [Einheit 4: Backend-Routen](#einheit-4-backend-routen).

## Bekannte Einschränkungen

<hier eintragen, was noch fehlt oder bekannt fehlerhaft ist>
