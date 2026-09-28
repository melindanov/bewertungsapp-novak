'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
teamId: {
  allowNull: false,
  type: Sequelize.INTEGER,
  references: {
    model: 'Teams',
    key: 'id'
  },
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
},
titel: {
  allowNull: false,
  type: Sequelize.STRING
},
beschreibung: {
  allowNull: false,
  type: Sequelize.TEXT
},
praesentiertAm: {
  allowNull: false,
  type: Sequelize.DATE
},
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Projects');
  }
};
