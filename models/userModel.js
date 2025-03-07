const { sequelize } = require('../db');
const { DataTypes } = require('sequelize');

const Utilisateur = sequelize.define('Utilisateur', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nom_utilisateur: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    mot_de_passe: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'client'
    },
    date_creation: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'utilisateurs',
    timestamps: false
});

module.exports = Utilisateur;
