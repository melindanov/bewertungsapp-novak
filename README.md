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

### Nachweise (Screenshots in `docs/screenshots/`)

### Aufbau

```
backend/
├── index.js              # bindet die Router ein + zentrale Fehlerbehandlung
└── routes/
    ├── helpers.js        # Validierungs-Hilfsfunktionen
    ├── teams.js          # /teams
    ├── projects.js       # /projects
    └── evaluations.js    # /evaluations, /evaluations/statistics
```

Übertragung vom Bibliotheksbeispiel auf die Bewertungsapp:

| Bibliotheksbeispiel        | Bewertungsapp                                        |
| -------------------------- | ---------------------------------------------------- |
| CRUD für Buch              | CRUD für `Team` und `Project`                        |
| Ausleihe (Buch + Leser)    | `Evaluation` (Project + Criterion + Juror)           |
| AVG der Bewertung pro Buch | AVG von `score` pro `projectId` und `criterionId`    |

### Allgemeine Fehlerantworten

Alle Fehler kommen als JSON, z. B. `{ "error": "Team mit ID 99 nicht gefunden" }`.

| Status | Bedeutung                                                                       |
| ------ | ------------------------------------------------------------------------------- |
| 200    | OK (GET, PUT)                                                                   |
| 201    | Datensatz angelegt (POST)                                                       |
| 204    | Datensatz gelöscht (DELETE), kein Body                                          |
| 400    | Pflichtfeld fehlt, falscher Datentyp, ungültige ID, ungültiges JSON, Fremdschlüssel existiert nicht, score außerhalb des Bereichs |
| 404    | Datensatz mit der ID in der URL nicht gefunden bzw. unbekannte Route            |
| 409    | doppelte Bewertung oder Löschen nicht möglich, weil Bewertungen daran hängen    |
| 500    | unerwarteter Serverfehler                                                       |

### Teams

| Methode | Pfad         | Zweck                                     | Erfolg | Fehler        |
| ------- | ------------ | ----------------------------------------- | ------ | ------------- |
| GET     | `/teams`     | alle Teams inkl. `Projects`               | 200    | –             |
| GET     | `/teams/:id` | ein Team inkl. `Members` und `Projects`   | 200    | 400, 404      |
| POST    | `/teams`     | Team anlegen                              | 201    | 400           |
| PUT     | `/teams/:id` | Team vollständig ändern                   | 200    | 400, 404      |
| DELETE  | `/teams/:id` | Team löschen (Members/Projects per CASCADE) | 204  | 400, 404, 409 |

Request-Body (POST und PUT, beide Felder Pflicht):

```json
{ "name": "Team Alpha", "klasse": "4aAPC" }
```

Beispielantwort `POST /teams` (201):

```json
{ "id": 1, "name": "Team Alpha", "klasse": "4aAPC", "updatedAt": "2026-10-28T09:00:00.000Z", "createdAt": "2026-10-28T09:00:00.000Z" }
```

Beispielfehler (400):

```json
{ "error": "Pflichtfelder fehlen", "fields": ["klasse"] }
```

`DELETE` liefert 409, wenn zu Projekten des Teams bereits Bewertungen existieren.

### Projects

| Methode | Pfad            | Zweck                                       | Erfolg | Fehler        |
| ------- | --------------- | ------------------------------------------- | ------ | ------------- |
| GET     | `/projects`     | alle Projekte inkl. `Team`                  | 200    | –             |
| GET     | `/projects/:id` | ein Projekt inkl. `Team` und `Evaluations`  | 200    | 400, 404      |
| POST    | `/projects`     | Projekt anlegen                             | 201    | 400           |
| PUT     | `/projects/:id` | Projekt vollständig ändern                  | 200    | 400, 404      |
| DELETE  | `/projects/:id` | Projekt löschen                             | 204    | 400, 404, 409 |

Request-Body (POST und PUT, alle Felder Pflicht, `teamId` muss existieren):

```json
{
  "teamId": 1,
  "titel": "Bewertungsapp",
  "beschreibung": "Ionic-App mit Express-Backend",
  "praesentiertAm": "2026-11-15"
}
```

Beispielantwort `GET /projects` (200):

```json
[
  {
    "id": 1,
    "teamId": 1,
    "titel": "Bewertungsapp",
    "beschreibung": "Ionic-App mit Express-Backend",
    "praesentiertAm": "2026-11-15T00:00:00.000Z",
    "createdAt": "2026-10-28T09:00:00.000Z",
    "updatedAt": "2026-10-28T09:00:00.000Z",
    "Team": { "id": 1, "name": "Team Alpha", "klasse": "4aAPC", "createdAt": "…", "updatedAt": "…" }
  }
]
```

Beispielfehler (400):

```json
{ "error": "Team mit ID 99 existiert nicht" }
```

`DELETE` liefert 409, wenn für das Projekt bereits Bewertungen existieren.

### Evaluations

| Methode | Pfad                       | Zweck                                         | Erfolg | Fehler   |
| ------- | -------------------------- | --------------------------------------------- | ------ | -------- |
| POST    | `/evaluations`             | Bewertung anlegen                             | 201    | 400, 409 |
| GET     | `/evaluations/statistics`  | Durchschnitt von `score` pro Projekt/Kriterium | 200   | –        |

Request-Body `POST /evaluations` (alle Felder Pflicht):

```json
{ "projectId": 1, "criterionId": 1, "jurorId": 1, "score": 8, "comment": "Gute Idee" }
```

Validierung:

* `projectId`, `criterionId`, `jurorId`: positive Ganzzahlen, Datensätze müssen existieren
* `score`: Ganzzahl von `0` bis `maxScore` des Kriteriums
* `comment`: nicht-leerer Text
* doppelte Bewertung (gleiches `projectId`, `criterionId`, `jurorId`) → 409 über den Unique-Constraint `unique_evaluation`

Beispielantwort (201):

```json
{ "id": 1, "projectId": 1, "criterionId": 1, "jurorId": 1, "score": 8, "comment": "Gute Idee", "updatedAt": "…", "createdAt": "…" }
```

Beispielfehler:

```json
{ "error": "score muss zwischen 0 und 10 liegen (Kriterium \"Innovation\")" }
```

```json
{ "error": "Referenzierte Datensätze existieren nicht", "notFound": ["Juror mit ID 99"] }
```

```json
{ "error": "Dieser Juror hat dieses Projekt für dieses Kriterium bereits bewertet" }
```

Beispielantwort `GET /evaluations/statistics` (200):

```json
[
  { "projectId": 1, "criterionId": 1, "averageScore": 7.5, "evaluationCount": 2 },
  { "projectId": 1, "criterionId": 2, "averageScore": 10, "evaluationCount": 1 }
]
```

Umsetzung mit Sequelize (MySQL liefert `AVG` als DECIMAL-String, daher Umwandlung in eine Zahl):

```js
Evaluation.findAll({
  attributes: [
    'projectId',
    'criterionId',
    [fn('AVG', col('score')), 'averageScore'],
    [fn('COUNT', col('id')), 'evaluationCount']
  ],
  group: ['projectId', 'criterionId'],
  raw: true
});
```

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
