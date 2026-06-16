const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('BlogPost', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    contenu: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    resume: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    auteur: {
      type: DataTypes.STRING,
      defaultValue: 'Linguère Digital'
    },
    categorie: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    vues: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    metaDescription: {
      type: DataTypes.STRING,
      allowNull: true
    },
    metaKeywords: {
      type: DataTypes.STRING,
      allowNull: true
    },
    publie: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true
  });
};
