const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Project', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    contenuComplet: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    categorie: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    technologies: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: true
    },
    lien: {
      type: DataTypes.STRING,
      allowNull: true
    },
    client: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dateProjets: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ordre: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    publie: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true
  });
};
