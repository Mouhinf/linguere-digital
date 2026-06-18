const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Service', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categorie: {
      type: DataTypes.ENUM(
        'informatique',
        'data-science',
        'marketing',
        'formation'
      ),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    descriptionLongue: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    icone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    prix: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    ordre: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    actif: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    modules: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue('modules');
        if (!raw) return [];
        try { return JSON.parse(raw); } catch { return []; }
      },
      set(val) {
        this.setDataValue('modules', JSON.stringify(val || []));
      }
    }
  }, {
    timestamps: true
  });
};
