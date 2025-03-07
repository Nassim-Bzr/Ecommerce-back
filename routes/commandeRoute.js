const express = require('express');
const router = express.Router();
const CommandeController = require('../controllers/commandeController');

router.post('/', CommandeController.createCommande); // Passer une commande
router.get('/user/:utilisateur_id', CommandeController.getCommandesUtilisateur); // Historique utilisateur
router.get('/', CommandeController.getAllCommandes); // Liste complète pour l'admin


router.put('/:id', CommandeController.updateCommande); // Mettre à jour une commande

module.exports = router;
