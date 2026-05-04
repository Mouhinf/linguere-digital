require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';

let sequelize;

if (NODE_ENV === 'production' && process.env.DB_DIALECT === 'mysql') {
  // MySQL production
  sequelize = new Sequelize(
    process.env.DB_NAME || 'linguere_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
} else {
  // SQLite development
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../dev.sqlite'),
    logging: false
  });
}

// Import models
const User = require('../models/User')(sequelize);
const Message = require('../models/Message')(sequelize);
const Service = require('../models/Service')(sequelize);
const Project = require('../models/Project')(sequelize);
const BlogPost = require('../models/BlogPost')(sequelize);
const Testimonial = require('../models/Testimonial')(sequelize);
const Settings = require('../models/Settings')(sequelize);

// Associations
Message.belongsTo(User, { foreignKey: 'userId', allowNull: true });
User.hasMany(Message, { foreignKey: 'userId' });

// Export
async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    await sequelize.sync({ alter: false });
    console.log('✅ Database synced');
  } catch (error) {
    console.error('❌ Database error:', error.message);
    throw error;
  }
}

module.exports = {
  sequelize,
  syncDatabase,
  models: {
    User,
    Message,
    Service,
    Project,
    BlogPost,
    Testimonial,
    Settings
  }
};
