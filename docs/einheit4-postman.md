# Einheit 4 – Postman-Testfälle

Basis-URL: `http://localhost:3000`
Header bei allen POST/PUT-Requests: `Content-Type: application/json` (in Postman: Body → raw → JSON).

## Vorbereitung

```bash
cd ~/workspace/4LH/bewertungsapp-novak
docker compose up -d
cd backend
npx sequelize-cli db:migrate        # falls noch nicht geschehen
npx sequelize-cli db:seed:all       # nur falls die Criteria-Tabelle leer ist
node index.js
```

Es gibt (noch) keine Route und keinen Seeder für Juroren. Für die Evaluation-Tests einmalig in Adminer (`http://localhost:8080`, Server `db`, Benutzer `bewertung`, Passwort `bewertungpass`, Datenbank `bewertungsapp_db`) unter **SQL-Kommando** ausführen:

```sql
INSERT INTO Jurors (name, email, createdAt, updatedAt)
VALUES ('Juror A', 'juror.a@test.at', NOW(), NOW()),
       ('Juror B', 'juror.b@test.at', NOW(), NOW());
```

Danach in Adminer die tatsächlichen IDs von `Criteria` und `Jurors` nachsehen. Die Beispiele unten gehen von `Criterion 1 = Innovation (maxScore 10)` und `Juror 1/2` aus. Wenn deine IDs anders sind, passe sie im Body an.

> Die IDs von Team und Projekt in den Beispielen (`1`, `2`) gelten für eine leere Datenbank. Verwende sonst die `id` aus der jeweiligen 201-Antwort.

---

## 1. Team CRUD

| #   | Request                | Body                                              | Erwartet |
| --- | ---------------------- | ------------------------------------------------- | -------- |
| T1  | `POST /teams`          | `{ "name": "Team Alpha", "klasse": "4aAPC" }`     | 201      |
| T2  | `GET /teams`           | –                                                 | 200, Liste mit Team Alpha |
| T3  | `GET /teams/1`         | –                                                 | 200, inkl. `Members` und `Projects` |
| T4  | `PUT /teams/1`         | `{ "name": "Team Alpha (neu)", "klasse": "4aAPC" }` | 200    |
| T5  | `POST /teams`          | `{ "name": "Team Alpha" }`                        | 400      |
| T6  | `GET /teams/999`       | –                                                 | 404      |
| T7  | `GET /teams/abc`       | –                                                 | 400      |
| T8  | `POST /teams`          | `{ "name": "Team Beta", "klasse": "4aAPC" }`      | 201 (Team zum Löschen) |
| T9  | `DELETE /teams/2`      | –                                                 | 204, kein Body |
| T10 | `DELETE /teams/2`      | –                                                 | 404      |

Antwort T1 (201):

```json
{
  "id": 1,
  "name": "Team Alpha",
  "klasse": "4aAPC",
  "updatedAt": "2026-10-28T09:00:00.000Z",
  "createdAt": "2026-10-28T09:00:00.000Z"
}
```

Antwort T5 (400):

```json
{ "error": "Pflichtfelder fehlen", "fields": ["klasse"] }
```

Antwort T6 (404):

```json
{ "error": "Team mit ID 999 nicht gefunden" }
```

## 2. Project CRUD

| #   | Request                 | Body                         | Erwartet |
| --- | ----------------------- | ---------------------------- | -------- |
| P1  | `POST /projects`        | siehe unten                  | 201      |
| P2  | `GET /projects`         | –                            | 200, jedes Projekt mit `Team` |
| P3  | `GET /projects/1`       | –                            | 200, inkl. `Team` und `Evaluations` |
| P4  | `PUT /projects/1`       | wie P1, `"titel": "Bewertungsapp v2"` | 200 |
| P5  | `POST /projects`        | `{ "titel": "Nur Titel" }`   | 400, `fields` listet fehlende Felder |
| P6  | `POST /projects`        | wie P1, aber `"teamId": 999` | 400, Team existiert nicht |
| P7  | `POST /projects`        | wie P1, aber `"praesentiertAm": "morgen"` | 400 |
| P8  | `POST /projects`        | wie P1, `"titel": "Wegwerfprojekt"` | 201 |
| P9  | `DELETE /projects/2`    | –                            | 204      |
| P10 | `GET /projects/2`       | –                            | 404      |

Body P1:

```json
{
  "teamId": 1,
  "titel": "Bewertungsapp",
  "beschreibung": "Ionic-App mit Express-Backend",
  "praesentiertAm": "2026-11-15"
}
```

Antwort P6 (400):

```json
{ "error": "Team mit ID 999 existiert nicht" }
```

## 3. Evaluation – Erfolg

| #  | Request             | Body                                                                          | Erwartet |
| -- | ------------------- | ----------------------------------------------------------------------------- | -------- |
| E1 | `POST /evaluations` | `{ "projectId": 1, "criterionId": 1, "jurorId": 1, "score": 8, "comment": "Gute Idee" }` | 201 |
| E2 | `POST /evaluations` | `{ "projectId": 1, "criterionId": 1, "jurorId": 2, "score": 7, "comment": "Solide" }`    | 201 |
| E3 | `POST /evaluations` | `{ "projectId": 1, "criterionId": 2, "jurorId": 1, "score": 10, "comment": "Sauber umgesetzt" }` | 201 |

Antwort E1 (201):

```json
{
  "id": 1,
  "projectId": 1,
  "criterionId": 1,
  "jurorId": 1,
  "score": 8,
  "comment": "Gute Idee",
  "updatedAt": "2026-10-28T09:05:00.000Z",
  "createdAt": "2026-10-28T09:05:00.000Z"
}
```

## 4. Evaluation – Validierungsfehler (400)

| #  | Body                                                                                   | Grund |
| -- | -------------------------------------------------------------------------------------- | ----- |
| V1 | `{ "projectId": 1 }`                                                                   | Pflichtfelder fehlen |
| V2 | `{ "projectId": 1, "criterionId": 1, "jurorId": 1, "score": 11, "comment": "Zu viel" }` | score > maxScore |
| V3 | `{ "projectId": 1, "criterionId": 1, "jurorId": 1, "score": -1, "comment": "Negativ" }` | score < 0 |
| V4 | `{ "projectId": 1, "criterionId": 1, "jurorId": 1, "score": 7.5, "comment": "Komma" }`  | keine Ganzzahl |
| V5 | `{ "projectId": 999, "criterionId": 1, "jurorId": 1, "score": 5, "comment": "X" }`       | Projekt existiert nicht |
| V6 | `{ "projectId": 1, "criterionId": 99, "jurorId": 99, "score": 5, "comment": "X" }`       | Kriterium und Juror existieren nicht |

Antwort V1:

```json
{ "error": "Pflichtfelder fehlen", "fields": ["criterionId", "jurorId", "score", "comment"] }
```

Antwort V2:

```json
{ "error": "score muss zwischen 0 und 10 liegen (Kriterium \"Innovation\")" }
```

Antwort V6:

```json
{
  "error": "Referenzierte Datensätze existieren nicht",
  "notFound": ["Kriterium mit ID 99", "Juror mit ID 99"]
}
```

## 5. Evaluation – doppelte Bewertung (409)

E1 ein zweites Mal senden:

```json
{ "projectId": 1, "criterionId": 1, "jurorId": 1, "score": 5, "comment": "Nochmal" }
```

Antwort (409), ausgelöst durch den Unique-Constraint `unique_evaluation` auf `(projectId, criterionId, jurorId)`:

```json
{ "error": "Dieser Juror hat dieses Projekt für dieses Kriterium bereits bewertet" }
```

## 6. Aggregation

`GET /evaluations/statistics` nach E1–E3:

```json
[
  { "projectId": 1, "criterionId": 1, "averageScore": 7.5, "evaluationCount": 2 },
  { "projectId": 1, "criterionId": 2, "averageScore": 10, "evaluationCount": 1 }
]
```

Kontrolle in Adminer (SQL-Kommando), das Ergebnis muss übereinstimmen:

```sql
SELECT projectId, criterionId, AVG(score) AS averageScore, COUNT(id) AS evaluationCount
FROM Evaluations
GROUP BY projectId, criterionId
ORDER BY projectId, criterionId;
```

## 7. Löschschutz (409)

| #  | Request              | Erwartet |
| -- | -------------------- | -------- |
| L1 | `DELETE /projects/1` | 409, weil Bewertungen existieren |
| L2 | `DELETE /teams/1`    | 409, weil Projekte des Teams Bewertungen haben |

---

## Screenshots erstellen (Linux Mint)

Screenshot-Werkzeug: `Druck`-Taste bzw. `Shift+Druck` (Bereich auswählen), oder **Menü → Bildschirmfoto**. Danach in `~/workspace/4LH/bewertungsapp-novak/docs/screenshots/` unter dem jeweiligen Namen speichern.

| Datei                         | Was zu sehen sein soll |
| ----------------------------- | ---------------------- |
| `e4-routes.png`               | VS Code: Explorer mit `backend/routes/` aufgeklappt und `backend/index.js` geöffnet (die `app.use("/teams", …)`-Zeilen sichtbar), unten das Terminal mit `node index.js` → „Backend läuft auf http://localhost:3000“ |
| `e4-team-crud.png`            | Postman: z. B. T1 (`POST /teams`, Status 201) mit Body und Antwort; optional zusätzlich T3 und T9 als Collapsed-History |
| `e4-project-crud.png`         | Postman: P2 (`GET /projects`, 200, mit `Team` in der Antwort) oder P1 (201) |
| `e4-evaluation-validation.png`| Postman: V2 (`score: 11` → 400) und doppelte Bewertung (409). Wenn beides nicht auf ein Bild passt: das 409-Bild nehmen und den 400-Fall daneben im zweiten Tab zeigen |
| `e4-aggregation.png`          | Postman: `GET /evaluations/statistics` (200) mit JSON-Antwort; ideal daneben Adminer mit dem SQL-Kontrollergebnis |
| `e4-readme.png`               | VS Code: `README.md` → Rechtsklick → **Vorschau öffnen** (`Ctrl+Shift+V`), Abschnitt „Einheit 4: Backend-Routen“ mit den abgehakten Punkten |

Tipp: In Postman Statuscode, URL, Body und Antwort gleichzeitig sichtbar halten (Fenster maximieren, Response-Bereich unten).
