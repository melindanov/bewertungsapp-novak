const express = require('express');
const { Team, Project, Member, Evaluation } = require('../models');
const { toPositiveInt, isNonEmptyString, missingFields } = require('./helpers');

const router = express.Router();

// Prüft name und klasse (beide Pflichtfelder laut Migration)
function validateTeam(body) {
    const missing = missingFields(body, ['name', 'klasse']);
    if (missing.length > 0) {
        return { error: 'Pflichtfelder fehlen', fields: missing };
    }
    if (!isNonEmptyString(body.name) || !isNonEmptyString(body.klasse)) {
        return { error: 'name und klasse müssen nicht-leere Texte sein' };
    }
    return null;
}

async function findTeamOr404(req, res, options = {}) {
    const id = toPositiveInt(req.params.id);
    if (!id) {
        res.status(400).json({ error: 'Ungültige Team-ID' });
        return null;
    }
    const team = await Team.findByPk(id, options);
    if (!team) {
        res.status(404).json({ error: `Team mit ID ${id} nicht gefunden` });
        return null;
    }
    return team;
}

// GET /teams – alle Teams inkl. Projekte
router.get('/', async (req, res) => {
    const teams = await Team.findAll({
        include: [Project],
        order: [['id', 'ASC']]
    });
    res.json(teams);
});

// GET /teams/:id – ein Team inkl. Mitglieder und Projekte
router.get('/:id', async (req, res) => {
    const team = await findTeamOr404(req, res, { include: [Member, Project] });
    if (!team) return;
    res.json(team);
});

// POST /teams – neues Team anlegen
router.post('/', async (req, res) => {
    const body = req.body || {};
    const validationError = validateTeam(body);
    if (validationError) {
        return res.status(400).json(validationError);
    }
    const team = await Team.create({
        name: body.name.trim(),
        klasse: body.klasse.trim()
    });
    res.status(201).json(team);
});

// PUT /teams/:id – Team vollständig aktualisieren
router.put('/:id', async (req, res) => {
    const team = await findTeamOr404(req, res);
    if (!team) return;

    const body = req.body || {};
    const validationError = validateTeam(body);
    if (validationError) {
        return res.status(400).json(validationError);
    }
    await team.update({
        name: body.name.trim(),
        klasse: body.klasse.trim()
    });
    res.json(team);
});

// DELETE /teams/:id – Team löschen (Members und Projects werden per CASCADE mitgelöscht)
router.delete('/:id', async (req, res) => {
    const team = await findTeamOr404(req, res);
    if (!team) return;

    // Bewertungen hängen ohne CASCADE an den Projekten → vorher prüfen
    const evaluationCount = await Evaluation.count({
        include: [{ model: Project, where: { teamId: team.id } }]
    });
    if (evaluationCount > 0) {
        return res.status(409).json({
            error: 'Team kann nicht gelöscht werden, weil zu seinen Projekten bereits Bewertungen existieren'
        });
    }
    await team.destroy();
    res.status(204).send();
});

module.exports = router;
