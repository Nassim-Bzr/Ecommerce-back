const { DataTypes } = require('sequelize');
const { sequelize } = require('../db'); 
const Utilisateur = require('./userModel');

const Commande = sequelize.define('Commande', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    utilisateur_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Permet d'éviter le problème avec ON DELETE SET NULL
        references: {
            model: Utilisateur,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    numero_commande: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    produits: {
        type: DataTypes.JSON,
        allowNull: false
    },
    prix_total: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    statut: {
        type: DataTypes.ENUM('en attente', 'expédié', 'livrée', 'annulée'),
        defaultValue: 'en attente'
    },
    adresse_facturation: {
        type: DataTypes.JSON,
        allowNull: false
    },
    adresse_livraison: {
        type: DataTypes.JSON,
        allowNull: false
    },
    date_creation: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'commandes',
    timestamps: false
});

// Association avec Utilisateur
Commande.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });
Utilisateur.hasMany(Commande, { foreignKey: 'utilisateur_id' });

module.exports = Commande;
