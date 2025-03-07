const { DataTypes } = require('sequelize');
const {sequelize} = require('../db'); // ✅ Assurez-vous que ça importe bien `sequelize`

const Categorie = sequelize.define('Categorie', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT
    },
    date_creation: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'categories',
    timestamps: false
});

module.exports = Categorie;
