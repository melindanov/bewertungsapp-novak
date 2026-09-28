'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Evaluations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      projectId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Projects',
          key: 'id'
        }
      },
      criterionId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Criteria',
          key: 'id'
        }
      },
      jurorId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Jurors',
          key: 'id'
        }
      },
      score: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      comment: {
        allowNull: false,
        type: Sequelize.TEXT
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

    await queryInterface.addConstraint('Evaluations', {
      fields: ['projectId', 'criterionId', 'jurorId'],
      type: 'unique',
      name: 'unique_evaluation'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Evaluations');
  }
};
