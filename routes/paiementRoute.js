const express = require('express');
const router = express.Router();
const { createPaymentIntent } = require('../controllers/paiementController');

// Route pour créer un Payment Intent
router.post('/create-payment-intent', createPaymentIntent);

module.exports = router;
