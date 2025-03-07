require('dotenv').config();
const mysql = require('mysql2');
const { Sequelize } = require('sequelize');

// Configuration MySQL via Heroku (JawsDB)
const dbUrl = process.env.JAWSDB_URL || null;

// Connexion avec mysql2 (pool)
const pool = dbUrl
  ? mysql.createPool(dbUrl) // Utilisation de JawsDB
  : mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ecommerce',
      connectionLimit: 10,
    });

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Erreur de connexion à MySQL :', err);
  } else {
    console.log('✅ Connecté à MySQL avec mysql2');
    connection.release();
  }
});

// Connexion avec Sequelize
const sequelize = dbUrl
  ? new Sequelize(dbUrl, {
      dialect: 'mysql',
      logging: false, // Désactiver les logs SQL
    })
  : new Sequelize(
      process.env.DB_NAME || 'ecommerce',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
      }
    );

// Vérifier la connexion Sequelize
sequelize
  .authenticate()
  .then(() => console.log('✅ Connecté à MySQL avec Sequelize'))
  .catch((err) => console.error('❌ Erreur Sequelize :', err));


  module.exports = { pool: pool.promise(), sequelize };