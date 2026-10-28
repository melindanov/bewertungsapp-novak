// Gemeinsame Hilfsfunktionen für die Router (Validierung)

// Liefert eine positive Ganzzahl oder null (z. B. für :id oder Fremdschlüssel)
function toPositiveInt(value) {
    const number = Number(value);
    if (value === null || value === undefined || value === '' || typeof value === 'boolean') {
        return null;
    }
    return Number.isInteger(number) && number > 0 ? number : null;
}

function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim() !== '';
}

function isValidDate(value) {
    return (typeof value === 'string' || typeof value === 'number') && !Number.isNaN(new Date(value).getTime());
}

// Gibt die Liste der fehlenden Felder zurück
function missingFields(body, fields) {
    return fields.filter((field) => body[field] === undefined || body[field] === null || body[field] === '');
}

module.exports = {
    toPositiveInt,
    isNonEmptyString,
    isValidDate,
    missingFields
};
