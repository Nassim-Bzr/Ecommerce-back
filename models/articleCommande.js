const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Commande = require('./commande.model');
const Produit = require('./produit.model');

const ArticleCommande = sequelize.define('ArticleCommande', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    quantite: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    prix: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'articles_commandes',
    timestamps: false
});

// Association avec Commande et Produit
ArticleCommande.belongsTo(Commande, { foreignKey: 'commande_id', onDelete: 'CASCADE' });
Commande.hasMany(ArticleCommande, { foreignKey: 'commande_id' });

ArticleCommande.belongsTo(Produit, { foreignKey: 'produit_id', onDelete: 'CASCADE' });
Produit.hasMany(ArticleCommande, { foreignKey: 'produit_id' });

module.exports = ArticleCommande;
