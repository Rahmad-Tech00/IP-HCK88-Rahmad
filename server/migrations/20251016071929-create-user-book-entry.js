'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserBookEntries', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },

      UserBookId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'UserBooks', key: 'id' },
        onDelete: 'CASCADE', onUpdate: 'CASCADE'
      },

      type: {
        type: Sequelize.ENUM('note','highlight','summary'),
        allowNull: false,
        defaultValue: 'note'
      },
      content: { type: Sequelize.TEXT, allowNull: false },
      page: { type: Sequelize.INTEGER },
      rating: { type: Sequelize.INTEGER },

      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    await queryInterface.addIndex('UserBookEntries', ['UserBookId'], { name: 'entries_userbookid_idx' });
    await queryInterface.addIndex('UserBookEntries', ['createdAt'], { name: 'entries_createdat_idx' });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('UserBookEntries', 'entries_userbookid_idx');
    await queryInterface.removeIndex('UserBookEntries', 'entries_createdat_idx');
    await queryInterface.dropTable('UserBookEntries');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_UserBookEntries_type";');
  }
};