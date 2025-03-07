const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Categorie = require('./categorieModel');

const SousCategorie = sequelize.define('SousCategorie', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT
  },
  date_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'sous_categories',
  timestamps: false
});

// Association avec Categorie (pas de many-to-many ici)
SousCategorie.belongsTo(Categorie, { foreignKey: 'categorie_id', onDelete: 'CASCADE' });
Categorie.hasMany(SousCategorie, { foreignKey: 'categorie_id' });

module.exports = SousCategorie;
