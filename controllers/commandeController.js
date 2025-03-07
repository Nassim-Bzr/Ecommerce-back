const { v4: uuidv4 } = require('uuid');
const Commande = require('../models/commandeModel');
const Produit = require('../models/produitModel');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

class CommandeController {
    
    // ✅ Passer une commande
    static async createCommande(req, res) {
        try {
            console.log("✅ Body reçu :", req.body);
            const { utilisateur_id, produits, adresse_facturation, adresse_livraison } = req.body;
    
            if (!Array.isArray(produits) || produits.length === 0) {
                return res.status(400).json({ error: "Le champ 'produits' doit être un tableau non vide." });
            }
    
            let prix_total = 0;
            const produitsDetails = [];
    
            for (const item of produits) {
                const produit = await Produit.findByPk(item.produit_id);
                if (!produit) {
                    return res.status(404).json({ error: `Produit ID ${item.produit_id} introuvable` });
                }
    
                prix_total += produit.prix * item.quantite;
                produitsDetails.push({
                    produit_id: produit.id,
                    nom: produit.nom,
                    quantite: item.quantite,
                    prix: produit.prix
                });
            }
    
            const nouvelleCommande = await Commande.create({
                numero_commande: `CMD-${uuidv4().slice(0, 8)}`,
                utilisateur_id,
                produits: JSON.stringify(produitsDetails),
                prix_total,
                adresse_facturation: JSON.stringify(adresse_facturation),
                adresse_livraison: JSON.stringify(adresse_livraison)
            });
    
            console.log("✅ Commande créée :", nouvelleCommande.toJSON());
    
            // ⚠️ Parse obligatoire AVANT l'email pour avoir un vrai objet utilisable
            const commandePourEmail = {
                ...nouvelleCommande.toJSON(),
                produits: JSON.parse(nouvelleCommande.produits),
                adresse_facturation: JSON.parse(nouvelleCommande.adresse_facturation),
                adresse_livraison: JSON.parse(nouvelleCommande.adresse_livraison)
            };
    
            await sendOrderConfirmationEmail(
                commandePourEmail.adresse_facturation.email,
                commandePourEmail
            );
    
            res.status(201).json({
                message: "Commande créée avec succès et email envoyé !",
                commande: commandePourEmail
            });
    
        } catch (error) {
            console.error('❌ Erreur lors de la création de la commande :', error.stack);
            res.status(500).json({ error: error.message });
          }          
    }
    
    
    
    

    // ✅ Récupérer les commandes d'un utilisateur
    static async getCommandesUtilisateur(req, res) {
        try {
            const commandes = await Commande.findAll({ where: { utilisateur_id: req.params.utilisateur_id } });
            if (!commandes.length) return res.status(404).json({ message: "Aucune commande trouvée" });

            res.json(commandes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ✅ Récupérer toutes les commandes (admin)
    static async getAllCommandes(req, res) {
        try {
            const commandes = await Commande.findAll();
            res.json(commandes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ✅ Mettre à jour une commande
    static async updateCommande(req, res) {
        try {
          const { id } = req.params;
          const { statut } = req.body;
      
          const commande = await Commande.findByPk(id);
          if (!commande) {
            return res.status(404).json({ error: "Commande non trouvée" });
          }
      
          // Validation des statuts possibles
          const statutsValides = ['en attente', 'expédiée', 'livrée', 'annulée'];
          if (!statutsValides.includes(statut)) {
            return res.status(400).json({ error: "Statut invalide" });
          }
      
          // Mise à jour du statut
          await commande.update({ statut });
      
          // Parser proprement les champs JSON pour le retour
          const commandeParsee = {
            ...commande.toJSON(),
            produits: JSON.parse(commande.produits),
            adresse_facturation: JSON.parse(commande.adresse_facturation),
            adresse_livraison: JSON.parse(commande.adresse_livraison),
          };
      
          res.json({
            message: "Commande mise à jour avec succès",
            commande: commandeParsee,
          });
      
        } catch (error) {
          console.error('❌ Erreur lors de la mise à jour de la commande :', error);
          res.status(500).json({ error: error.message });
        }
      }
}

module.exports = CommandeController;
