const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Produit = sequelize.define('Produit', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  prix: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  chemin_image: {
    type: DataTypes.TEXT
  },
  date_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'produits',
  timestamps: false
});

// Définition de l'association many-to-many avec SousCategorie
setImmediate(() => {
  const SousCategorie = require('./sousCategorieModels');
  Produit.belongsToMany(SousCategorie, {
    through: 'produitsouscategorie',
    foreignKey: 'produitId',
    onDelete: 'CASCADE'
  });
});

module.exports = Produit;
