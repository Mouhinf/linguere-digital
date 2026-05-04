const { sequelize, syncDatabase, models } = require('../config/database');

module.exports = {
  sequelize,
  syncDatabase,
  ...models
};
