const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Setting', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    categorie: {
      type: DataTypes.ENUM('entreprise', 'reseaux', 'seo', 'systeme'),
      allowNull: false
    },
    cle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    valeur: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: false,
    indexes: [
      { unique: true, fields: ['categorie', 'cle'] }
    ]
  });
};
