'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_UserBooks_status" 
      RENAME VALUE 'finished' TO 'completed';
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_UserBooks_status" 
      RENAME VALUE 'completed' TO 'finished';
    `);
  }
};
