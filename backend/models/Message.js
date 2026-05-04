const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true }
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    service: {
      type: DataTypes.STRING,
      allowNull: true
    },
    budget: {
      type: DataTypes.STRING,
      allowNull: true
    },
    objet: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    statut: {
      type: DataTypes.ENUM('nouveau', 'lu', 'repond', 'ferme'),
      defaultValue: 'nouveau'
    },
    lu: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: true
  });
};
