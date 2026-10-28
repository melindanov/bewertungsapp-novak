const express = require("express");

const teamRoutes = require("./routes/teams");
const projectRoutes = require("./routes/projects");
const evaluationRoutes = require("./routes/evaluations");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Bewertungsapp Backend läuft!"
    });
});

app.use("/teams", teamRoutes);
app.use("/projects", projectRoutes);
app.use("/evaluations", evaluationRoutes);

// Unbekannte Route
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} nicht gefunden` });
});

// Zentrale Fehlerbehandlung (Express 5 leitet Fehler aus async-Handlern automatisch hierher)
app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ error: "Ungültiges JSON im Request-Body" });
    }
    console.error(err);
    res.status(500).json({ error: "Interner Serverfehler" });
});

// Server nur starten, wenn die Datei direkt ausgeführt wird (node index.js)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Backend läuft auf http://localhost:${PORT}`);
    });
}

module.exports = app;
