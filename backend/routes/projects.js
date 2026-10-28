const express = require('express');
const { Project, Team, Evaluation, Criterion, Juror } = require('../models');
const { toPositiveInt, isNonEmptyString, isValidDate, missingFields } = require('./helpers');

const router = express.Router();

const REQUIRED_FIELDS = ['teamId', 'titel', 'beschreibung', 'praesentiertAm'];

// Prüft Pflichtfelder, Datentypen und ob das referenzierte Team existiert.
// Gibt { status, body } bei einem Fehler zurück, sonst { values }.
async function validateProject(body) {
    const missing = missingFields(body, REQUIRED_FIELDS);
    if (missing.length > 0) {
        return { status: 400, body: { error: 'Pflichtfelder fehlen', fields: missing } };
    }

    const teamId = toPositiveInt(body.teamId);
    if (!teamId) {
        return { status: 400, body: { error: 'teamId muss eine positive Ganzzahl sein' } };
    }
    if (!isNonEmptyString(body.titel) || !isNonEmptyString(body.beschreibung)) {
        return { status: 400, body: { error: 'titel und beschreibung müssen nicht-leere Texte sein' } };
    }
    if (!isValidDate(body.praesentiertAm)) {
        return { status: 400, body: { error: 'praesentiertAm muss ein gültiges Datum sein (z. B. 2026-11-15)' } };
    }

    // Fremdschlüssel prüfen
    const team = await Team.findByPk(teamId);
    if (!team) {
        return { status: 400, body: { error: `Team mit ID ${teamId} existiert nicht` } };
    }

    return {
        values: {
            teamId,
            titel: body.titel.trim(),
            beschreibung: body.beschreibung.trim(),
            praesentiertAm: new Date(body.praesentiertAm)
        }
    };
}

async function findProjectOr404(req, res, options = {}) {
    const id = toPositiveInt(req.params.id);
    if (!id) {
        res.status(400).json({ error: 'Ungültige Projekt-ID' });
        return null;
    }
    const project = await Project.findByPk(id, options);
    if (!project) {
        res.status(404).json({ error: `Projekt mit ID ${id} nicht gefunden` });
        return null;
    }
    return project;
}

// GET /projects – alle Projekte inkl. Team
router.get('/', async (req, res) => {
    const projects = await Project.findAll({
        include: [Team],
        order: [['id', 'ASC']]
    });
    res.json(projects);
});

// GET /projects/:id – ein Projekt inkl. Team und Bewertungen (mit Kriterium und Juror-Name)
router.get('/:id', async (req, res) => {
    const project = await findProjectOr404(req, res, {
        include: [
            Team,
            { model: Evaluation, include: [Criterion, { model: Juror, attributes: ['id', 'name'] }] }
        ]
    });
    if (!project) return;
    res.json(project);
});

// POST /projects – neues Projekt anlegen
router.post('/', async (req, res) => {
    const result = await validateProject(req.body || {});
    if (!result.values) {
        return res.status(result.status).json(result.body);
    }
    const project = await Project.create(result.values);
    res.status(201).json(project);
});

// PUT /projects/:id – Projekt vollständig aktualisieren
router.put('/:id', async (req, res) => {
    const project = await findProjectOr404(req, res);
    if (!project) return;

    const result = await validateProject(req.body || {});
    if (!result.values) {
        return res.status(result.status).json(result.body);
    }
    await project.update(result.values);
    res.json(project);
});

// DELETE /projects/:id – Projekt löschen, sofern keine Bewertungen existieren
router.delete('/:id', async (req, res) => {
    const project = await findProjectOr404(req, res);
    if (!project) return;

    const evaluationCount = await Evaluation.count({ where: { projectId: project.id } });
    if (evaluationCount > 0) {
        return res.status(409).json({
            error: `Projekt kann nicht gelöscht werden, weil bereits ${evaluationCount} Bewertung(en) existieren`
        });
    }
    await project.destroy();
    res.status(204).send();
});

module.exports = router;
