require('dotenv').config(); // Charge les variables d'environnement
const express = require('express');
const { sequelize } = require('./db');
const utilisateurRoutes = require('./routes/userRoute');
const categorieRoutes = require('./routes/categorieRoute');
const sousCategorieRoutes = require('./routes/sousCategorieRoute');
const produitRoutes = require('./routes/produitsRoute');
const paiementRoutes = require('./routes/paiementRoute');  // Importation du routeur de paiement
const commandeRoutes = require('./routes/commandeRoute');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const csrfProtection = require('./middlewares/csrf');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

const allowedOrigin = process.env.NODE_ENV === 'production'
  ? "https://ecommerce-zci9.vercel.app"
  : "http://localhost:3000";

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"]
}));

app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Configuration de Multer pour gérer les uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Route de test pour l'upload d'image
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier fourni' });
  }
  res.status(200).json({
    message: 'Fichier uploadé avec succès',
    filePath: `/uploads/${req.file.filename}`
  });
});

// Servir les fichiers statiques
app.use('/uploads', express.static('uploads'));

// Montage du routeur de paiement sous le préfixe "/payment"
// L'URL complète sera : http://localhost:5000/payment/create-payment-intent
app.use('/payment', paiementRoutes);

// Route de bienvenue
app.get('/', (req, res) => {
  res.send("Bienvenue sur l'API");
});

// Routes principales
app.use('/utilisateurs', utilisateurRoutes);
app.use('/categories', categorieRoutes);
app.use('/sous-categories', sousCategorieRoutes);
app.use('/produits', produitRoutes);
app.use('/commandes', commandeRoutes); 

// Synchronisation de la base de données
sequelize.sync({ alter: true })
  .then(() => console.log("✅ Base de données synchronisée avec succès !"))
  .catch(err => console.error("❌ Erreur lors de la synchronisation de la BDD :", err));

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
