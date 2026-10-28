const express = require('express');
const { fn, col, UniqueConstraintError } = require('sequelize');
const { Evaluation, Project, Criterion, Juror } = require('../models');
const { toPositiveInt, isNonEmptyString, missingFields } = require('./helpers');

const router = express.Router();

// GET /evaluations/statistics – Durchschnitt von score pro Projekt und Kriterium
router.get('/statistics', async (req, res) => {
    // Nur gruppierte Spalten + Aggregatfunktionen auswählen (MySQL ONLY_FULL_GROUP_BY)
    const rows = await Evaluation.findAll({
        attributes: [
            'projectId',
            'criterionId',
            [fn('AVG', col('score')), 'averageScore'],
            [fn('COUNT', col('id')), 'evaluationCount']
        ],
        group: ['projectId', 'criterionId'],
        order: [['projectId', 'ASC'], ['criterionId', 'ASC']],
        raw: true
    });

    // MySQL liefert AVG als DECIMAL-String (z. B. "7.5000") → in Zahl umwandeln
    const statistics = rows.map((row) => ({
        projectId: row.projectId,
        criterionId: row.criterionId,
        averageScore: Math.round(Number(row.averageScore) * 100) / 100,
        evaluationCount: Number(row.evaluationCount)
    }));

    res.json(statistics);
});

// POST /evaluations – neue Bewertung anlegen
router.post('/', async (req, res) => {
    const body = req.body || {};

    const missing = missingFields(body, ['projectId', 'criterionId', 'jurorId', 'score', 'comment']);
    if (missing.length > 0) {
        return res.status(400).json({ error: 'Pflichtfelder fehlen', fields: missing });
    }

    const projectId = toPositiveInt(body.projectId);
    const criterionId = toPositiveInt(body.criterionId);
    const jurorId = toPositiveInt(body.jurorId);
    if (!projectId || !criterionId || !jurorId) {
        return res.status(400).json({ error: 'projectId, criterionId und jurorId müssen positive Ganzzahlen sein' });
    }

    const score = typeof body.score === 'boolean' ? NaN : Number(body.score);
    if (!Number.isInteger(score)) {
        return res.status(400).json({ error: 'score muss eine Ganzzahl sein' });
    }
    if (!isNonEmptyString(body.comment)) {
        return res.status(400).json({ error: 'comment muss ein nicht-leerer Text sein' });
    }

    // Fremdschlüssel prüfen
    const [project, criterion, juror] = await Promise.all([
        Project.findByPk(projectId),
        Criterion.findByPk(criterionId),
        Juror.findByPk(jurorId)
    ]);
    const notFound = [];
    if (!project) notFound.push(`Projekt mit ID ${projectId}`);
    if (!criterion) notFound.push(`Kriterium mit ID ${criterionId}`);
    if (!juror) notFound.push(`Juror mit ID ${jurorId}`);
    if (notFound.length > 0) {
        return res.status(400).json({ error: 'Referenzierte Datensätze existieren nicht', notFound });
    }

    // Punktebereich anhand von maxScore des Kriteriums prüfen
    if (score < 0 || score > criterion.maxScore) {
        return res.status(400).json({
            error: `score muss zwischen 0 und ${criterion.maxScore} liegen (Kriterium "${criterion.name}")`
        });
    }

    try {
        const evaluation = await Evaluation.create({
            projectId,
            criterionId,
            jurorId,
            score,
            comment: body.comment.trim()
        });
        res.status(201).json(evaluation);
    } catch (err) {
        // Unique-Constraint (projectId, criterionId, jurorId) aus der Migration
        if (err instanceof UniqueConstraintError) {
            return res.status(409).json({
                error: 'Dieser Juror hat dieses Projekt für dieses Kriterium bereits bewertet'
            });
        }
        throw err;
    }
});

module.exports = router;
