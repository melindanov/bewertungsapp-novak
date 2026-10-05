'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('Criteria', [
      {
        name: 'Innovation',
        maxScore: 10,
        weight: 1.0,
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Technische Umsetzung',
        maxScore: 10,
        weight: 1.5,
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Präsentation',
        maxScore: 10,
        weight: 1.0,
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Dokumentation',
        maxScore: 10,
        weight: 1.0,
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Criteria', null, {});
  }
};
