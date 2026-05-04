const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Testimonial', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    entreprise: {
      type: DataTypes.STRING,
      allowNull: true
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contenu: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    etoiles: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      validate: { min: 1, max: 5 }
    },
    approuve: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    ordre: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: true
  });
};
