'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_UserBookEntries_type" 
      ADD VALUE IF NOT EXISTS 'review';
    `);
    
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_UserBookEntries_type" 
      ADD VALUE IF NOT EXISTS 'quote';
    `);
  },

  async down(queryInterface, Sequelize) {
    console.log('Cannot automatically downgrade ENUM type additions');
  }
};
