'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserBookEntry = sequelize.define('UserBookEntry', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    UserBookId: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM('note','review','quote','summary','highlight'), defaultValue: 'note' },
    content: { type: DataTypes.TEXT, allowNull: false },
    page: DataTypes.INTEGER,
    rating: DataTypes.INTEGER
  }, { tableName: 'UserBookEntries' });

  UserBookEntry.associate = (models) => {
    UserBookEntry.belongsTo(models.UserBook, { foreignKey: 'UserBookId' });
  };

  return UserBookEntry;
};
