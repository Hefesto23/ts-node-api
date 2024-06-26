const config = require('../config/config');

let User;

if (config.dbType === 'mongodb') {
  User = require('./userModelMongo');
} else if (config.dbType === 'mysql') {
  User = require('./userModelMysql');
}

module.exports = {
  User
};
