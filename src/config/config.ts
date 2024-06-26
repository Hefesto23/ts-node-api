import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  dbType: process.env.DB_TYPE || 'mysql',
  mongoUri: process.env.MONGO_URI,
  mysqlHost: process.env.MYSQL_HOST,
  mysqlUser: process.env.MYSQL_USER,
  mysqlPassword: process.env.MYSQL_PASSWORD,
  mysqlDatabase: process.env.MYSQL_DATABASE,
  nodeEnv: process.env.NODE_ENV || 'development'
};

export default config;
