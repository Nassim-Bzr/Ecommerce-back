const SousCategorie = require('../models/sousCategorieModels');

class SousCategorieController {
    static async getAllSousCategories(req, res) {
        try {
            const sousCategories = await SousCategorie.findAll();
            res.json(sousCategories);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getSousCategorieById(req, res) {
        try {
            const sousCategorie = await SousCategorie.findByPk(req.params.id);
            if (!sousCategorie) return res.status(404).json({ message: "Sous-catégorie non trouvée" });
            res.json(sousCategorie);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async createSousCategorie(req, res) {
        try {
            if (Array.isArray(req.body)) {
                // 🔥 Insertion multiple si on envoie un tableau
                const newSousCategories = await SousCategorie.bulkCreate(req.body);
                res.status(201).json(newSousCategories);
            } else {
                // ✅ Insertion unique si on envoie un seul objet
                const newSousCategorie = await SousCategorie.create(req.body);
                res.status(201).json(newSousCategorie);
            }
        } catch (err) {
            console.error("❌ Erreur lors de la création des sous-catégories :", err);
            res.status(500).json({ error: err.message });
        }
    }

    static async updateSousCategorie(req, res) {
        try {
            const [updated] = await SousCategorie.update(req.body, { where: { id: req.params.id } });
            if (!updated) return res.status(404).json({ message: "Sous-catégorie non trouvée" });
            res.json({ message: "Sous-catégorie mise à jour avec succès" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async deleteSousCategorie(req, res) {
        try {
            const deleted = await SousCategorie.destroy({ where: { id: req.params.id } });
            if (!deleted) return res.status(404).json({ message: "Sous-catégorie non trouvée" });
            res.json({ message: "Sous-catégorie supprimée avec succès" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}


module.exports = SousCategorieController;
