require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "ecom",
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false // Désactive les logs SQL (optionnel)
  }
};
