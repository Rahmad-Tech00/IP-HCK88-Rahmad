'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserBooks', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },

      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE', onUpdate: 'CASCADE'
      },

      BookId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Books', key: 'id' },
        onDelete: 'CASCADE', onUpdate: 'CASCADE'
      },

      status: {
        type: Sequelize.ENUM('to-read','reading','finished'),
        allowNull: false,
        defaultValue: 'to-read'
      },

      shelfName: { type: Sequelize.STRING },
      currentPage: { type: Sequelize.INTEGER },
      isFavorite: { type: Sequelize.BOOLEAN, defaultValue: false },

      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    await queryInterface.addConstraint('UserBooks', {
      fields: ['UserId', 'BookId'],
      type: 'unique',
      name: 'userbooks_userid_bookid_unique'
    });

    await queryInterface.addIndex('UserBooks', ['UserId'], { name: 'userbooks_userid_idx' });
    await queryInterface.addIndex('UserBooks', ['BookId'], { name: 'userbooks_bookid_idx' });
    await queryInterface.addIndex('UserBooks', ['status'], { name: 'userbooks_status_idx' });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('UserBooks', 'userbooks_userid_idx');
    await queryInterface.removeIndex('UserBooks', 'userbooks_bookid_idx');
    await queryInterface.removeIndex('UserBooks', 'userbooks_status_idx');
    await queryInterface.removeConstraint('UserBooks', 'userbooks_userid_bookid_unique');
    await queryInterface.dropTable('UserBooks');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_UserBooks_status";');
  }
};
