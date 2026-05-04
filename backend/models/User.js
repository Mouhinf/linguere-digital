const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: true
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user'
    },
    actif: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  User.prototype.verifyPassword = async function(password) {
    return bcrypt.compare(password, this.password);
  };

  User.prototype.toJSON = function() {
    const { password, ...data } = this.get();
    return data;
  };

  return User;
};
