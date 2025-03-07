require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Product = require('../models/produitModel'); // Vérifiez que le chemin est correct

const createPaymentIntent = async (req, res) => {
  console.log("Corps de la requête :", req.body);

  const { cart, amount, currency } = req.body;

  // Vérification des données envoyées
  if (!cart || !Array.isArray(cart)) {
    return res.status(400).json({ error: "Panier invalide" });
  }
  if (!amount || !currency) {
    return res.status(400).json({ error: "Montant ou devise manquant(e)" });
  }

  try {
    // Vérification et mise à jour du stock pour chaque produit du panier
    for (const item of cart) {
      // Utilisation de findByPk pour rechercher par clé primaire (et conversion en nombre si nécessaire)
      const product = await Product.findByPk(Number(item.id));
      if (!product) {
        return res.status(404).json({ error: `Produit avec l'ID ${item.id} non trouvé` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Stock insuffisant pour le produit ${product.nom}` });
      }
      await Product.update(
        { stock: product.stock - item.quantity },
        { where: { id: item.id } }
      );
    }

    // Création du Payment Intent avec Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,   // Montant en centimes
      currency, // Exemple : "usd"
    });
    console.log("PaymentIntent créé :", paymentIntent);

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Erreur lors de la création de l'intent de paiement :", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPaymentIntent };
