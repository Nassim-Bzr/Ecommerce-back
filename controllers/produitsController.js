const Produit = require('../models/produitModel');
const SousCategorie = require('../models/sousCategorieModels');
const Categorie = require('../models/categorieModel'); // Import nécessaire pour l'inclusion imbriquée
const upload = require('../middlewares/multerConfig');
const path = require('path');
const fs = require('fs');


class ProduitController {

  static async getAllProduits(req, res) {
    try {
      const produits = await Produit.findAll({
        include: [{
          model: SousCategorie,
          attributes: ['id', 'nom'],
          through: { attributes: [] },
          include: [{
            model: Categorie,
            attributes: ['id', 'nom']
          }]
        }]
      });
  
      // 🔥 Correction du chemin d'image
      const produitsCorriges = produits.map(produit => ({
        ...produit.toJSON(),
        chemin_image: produit.chemin_image ? `http://localhost:5000${produit.chemin_image}` : null
      }));
  
      res.json(produitsCorriges);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  


  static async getProduitById(req, res) {
    try {
      const produit = await Produit.findByPk(req.params.id, {
        include: [{
          model: SousCategorie,
          attributes: ['id', 'nom'],
          through: { attributes: [] },
          include: [{
            model: Categorie,
            attributes: ['id', 'nom']
          }]
        }]
      });
      if (!produit) return res.status(404).json({ message: "Produit non trouvé" });
      res.json(produit);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async createProduit(req, res) {
    try {
      const { nom, description, prix, stock } = req.body;
      const chemin_image = req.file ? `uploads/${req.file.filename}` : null;  // Sans le `/` au début


      // On s'attend à recevoir un champ "sousCategories" qui contient un JSON représentant un tableau d'identifiants
      let sousCategoriesIds = [];
      if (req.body.sousCategories) {
        try {
          sousCategoriesIds = JSON.parse(req.body.sousCategories);
        } catch (err) {
          sousCategoriesIds = req.body.sousCategories;
        }
      }

      // Création du produit
      const newProduit = await Produit.create({
        nom,
        description,
        prix,
        stock,
        chemin_image
      });

      // Association du produit aux sous-catégories (si fournies)
      if (sousCategoriesIds && sousCategoriesIds.length > 0) {
        await newProduit.setSousCategories(sousCategoriesIds);
      }

      // Recharge le produit avec ses associations imbriquées pour la réponse
      const produitAvecAssociations = await Produit.findByPk(newProduit.id, {
        include: [{
          model: SousCategorie,
          attributes: ['id', 'nom'],
          through: { attributes: [] },
          include: [{
            model: Categorie,
            attributes: ['id', 'nom']
          }]
        }]
      });

      res.status(201).json({
        message: 'Produit ajouté avec succès',
        produit: produitAvecAssociations
      });
    } catch (err) {
      console.error('❌ Erreur lors de la création du produit :', err);
      res.status(500).json({ error: err.message });
    }
  }

  static async updateProduit(req, res) {
    try {
      const [updated] = await Produit.update(req.body, { where: { id: req.params.id } });
      if (!updated) return res.status(404).json({ message: "Produit non trouvé" });
      res.json({ message: "Produit mis à jour avec succès" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteProduit(req, res) {
    try {
      const produit = await Produit.findByPk(req.params.id);

      if (!produit) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }

      // Suppression de l'image associée (si elle existe)
      if (produit.chemin_image) {
        const imagePath = path.join(__dirname, '..', 'uploads', path.basename(produit.chemin_image));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`✅ Image supprimée: ${imagePath}`);
        } else {
          console.log(`⚠️ L'image n'existe pas: ${imagePath}`);
        }
      }

      // Suppression du produit
      await produit.destroy();

      res.json({ message: "✅ Produit et image supprimés avec succès !" });
    } catch (err) {
      console.error('❌ Erreur lors de la suppression du produit :', err);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }
}

module.exports = ProduitController;
