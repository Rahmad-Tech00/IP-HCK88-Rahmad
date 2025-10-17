'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    openLibraryId: DataTypes.STRING,
    title: { type: DataTypes.STRING, allowNull: false },
    authors: DataTypes.JSONB,
    coverUrl: DataTypes.STRING,
    pages: DataTypes.INTEGER,
    publishedYear: DataTypes.INTEGER
  }, { tableName: 'Books' });

  Book.associate = (models) => {
    Book.hasMany(models.UserBook, { foreignKey: 'BookId', onDelete: 'CASCADE' });
  };

  return Book;
};