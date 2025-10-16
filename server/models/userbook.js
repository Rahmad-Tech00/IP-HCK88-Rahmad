'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserBook = sequelize.define('UserBook', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    UserId: { type: DataTypes.INTEGER, allowNull: false },
    BookId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('to-read','reading','completed'), defaultValue: 'to-read' },
    shelfName: DataTypes.STRING,
    currentPage: DataTypes.INTEGER,
    isFavorite: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { tableName: 'UserBooks' });

  UserBook.associate = (models) => {
    UserBook.belongsTo(models.User, { foreignKey: 'UserId' });
    UserBook.belongsTo(models.Book, { foreignKey: 'BookId' });
    UserBook.hasMany(models.UserBookEntry, { foreignKey: 'UserBookId', onDelete: 'CASCADE' });
  };

  return UserBook;
};