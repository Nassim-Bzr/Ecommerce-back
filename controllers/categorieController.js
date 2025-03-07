const Categorie = require('../models/categorieModel');

class CategorieController {
    static async getAllCategories(req, res) {
        try {
            const categories = await Categorie.findAll();
            res.json(categories);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getCategorieById(req, res) {
        try {
            const categorie = await Categorie.findByPk(req.params.id);
            if (!categorie) return res.status(404).json({ message: "Catégorie non trouvée" });
            res.json(categorie);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async createCategorie(req, res) {
        try {
            if (Array.isArray(req.body)) {
                // 🔥 Insertion multiple si on envoie un tableau
                const newCategories = await Categorie.bulkCreate(req.body);
                res.status(201).json(newCategories);
            } else {
                // ✅ Insertion unique si on envoie un seul objet
                const newCategorie = await Categorie.create(req.body);
                res.status(201).json(newCategorie);
            }
        } catch (err) {
            console.error("❌ Erreur lors de la création des catégories :", err);
            res.status(500).json({ error: err.message });
        }
    }
    
    

    static async updateCategorie(req, res) {
        try {
            const [updated] = await Categorie.update(req.body, { where: { id: req.params.id } });
            if (!updated) return res.status(404).json({ message: "Catégorie non trouvée" });
            res.json({ message: "Catégorie mise à jour avec succès" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async deleteCategorie(req, res) {
        try {
            const deleted = await Categorie.destroy({ where: { id: req.params.id } });
            if (!deleted) return res.status(404).json({ message: "Catégorie non trouvée" });
            res.json({ message: "Catégorie supprimée avec succès" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = CategorieController;
