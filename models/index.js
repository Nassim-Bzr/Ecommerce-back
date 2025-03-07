'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== path.basename(__filename) && file.endsWith('.js'))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
