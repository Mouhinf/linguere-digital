require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';

let sequelize;

if (NODE_ENV === 'production' && process.env.DB_DIALECT === 'mysql') {
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
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../dev.sqlite'),
    logging: false
  });
}

// Import and initialize models
const UserModel = require('../models/User')(sequelize);
const MessageModel = require('../models/Message')(sequelize);
const ServiceModel = require('../models/Service')(sequelize);
const ProjectModel = require('../models/Project')(sequelize);
const BlogPostModel = require('../models/BlogPost')(sequelize);
const TestimonialModel = require('../models/Testimonial')(sequelize);
const SettingModel = require('../models/Settings')(sequelize);

// Associations
MessageModel.belongsTo(UserModel, { foreignKey: 'userId', allowNull: true });
UserModel.hasMany(MessageModel, { foreignKey: 'userId' });

// Sync database
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

const models = {
  User: UserModel,
  Message: MessageModel,
  Service: ServiceModel,
  Project: ProjectModel,
  BlogPost: BlogPostModel,
  Testimonial: TestimonialModel,
  Settings: SettingModel
};

module.exports = {
  sequelize,
  syncDatabase,
  models,
  ...models
};
