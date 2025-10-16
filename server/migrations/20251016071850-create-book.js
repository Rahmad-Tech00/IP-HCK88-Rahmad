'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Books', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      openLibraryId: { type: Sequelize.STRING },
      title: { type: Sequelize.STRING, allowNull: false },
      authors: { type: Sequelize.JSONB },       // Postgres JSONB
      coverUrl: { type: Sequelize.STRING },
      pages: { type: Sequelize.INTEGER },
      publishedYear: { type: Sequelize.INTEGER },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
    await queryInterface.addIndex('Books', ['title'], { name: 'books_title_idx' });
    await queryInterface.addIndex('Books', ['openLibraryId'], { name: 'books_openlibraryid_idx' });
  },
  async down(queryInterface) {
    await queryInterface.removeIndex('Books', 'books_title_idx');
    await queryInterface.removeIndex('Books', 'books_openlibraryid_idx');
    await queryInterface.dropTable('Books');
  }
};
