'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // PostgreSQL requires ALTER TYPE to add new enum values
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
    // Downgrade is complex for ENUMs in PostgreSQL
    // Would require recreating the type and column
    console.log('Cannot automatically downgrade ENUM type additions');
  }
};
