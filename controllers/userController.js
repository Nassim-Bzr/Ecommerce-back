const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UtilisateurModel = require("../models/userModel"); // ✅ Importer le modèle utilisateur

class UtilisateurController {
    // ✅ Récupérer tous les utilisateurs (Admin uniquement)
    static async getAllUsers(req, res) {
        try {
            const users = await UtilisateurModel.findAll();
            console.log("📢 Données récupérées :", users);
            res.json(users);
        } catch (err) {
            console.error("💥 Erreur lors de la récupération des utilisateurs :", err);
            res.status(500).json({ error: "Erreur serveur lors de la récupération des utilisateurs." });
        }
    }

    // ✅ Récupérer un utilisateur par ID
    static async getUserById(req, res) {
        try {
            const user = await UtilisateurModel.findByPk(req.params.id);
            if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

            res.json(user);
        } catch (err) {
            console.error("💥 Erreur lors de la récupération de l'utilisateur :", err);
            res.status(500).json({ error: "Erreur serveur lors de la récupération de l'utilisateur." });
        }
    }

    // ✅ Connexion utilisateur
    static async loginUser(req, res) {
        try {
            console.log("📥 Données reçues pour connexion :", req.body);

            const { email, mot_de_passe } = req.body;
            if (!email || !mot_de_passe) {
                return res.status(400).json({ message: "Tous les champs sont requis." });
            }

            // Vérifier si l'utilisateur existe
            const user = await UtilisateurModel.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: "Email ou mot de passe incorrect." });
            }

            // Vérifier le mot de passe
            const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Email ou mot de passe incorrect." });
            }

            // Générer un token JWT avec le rôle de l'utilisateur
            const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET || "SECRET_KEY",
                { expiresIn: "24h" }
            );

            res.json({
                message: "Connexion réussie !",
                token,
                user: {
                    id: user.id,
                    nom_utilisateur: user.nom_utilisateur,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (err) {
            console.error("💥 Erreur serveur lors de la connexion :", err);
            res.status(500).json({ error: "Erreur serveur lors de la connexion." });
        }
    }

    // ✅ Création d'un utilisateur (Inscription)
    static async createUser(req, res) {
        try {
            const { nom_utilisateur, email, mot_de_passe, role } = req.body;

            if (!nom_utilisateur || !email || !mot_de_passe) {
                return res.status(400).json({ message: "Tous les champs sont requis." });
            }

            // Vérifier si l'email est déjà utilisé
            const existingUser = await UtilisateurModel.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: "Cet email est déjà utilisé." });
            }

            // Hacher le mot de passe
            const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

            // Créer l'utilisateur avec le rôle par défaut "client"
            const newUser = await UtilisateurModel.create({
                nom_utilisateur,
                email,
                mot_de_passe: hashedPassword,
                role: role || "client",
            });

            res.status(201).json({ message: "Utilisateur créé avec succès.", user: newUser });
        } catch (err) {
            console.error("💥 Erreur serveur lors de la création de l'utilisateur :", err);
            res.status(500).json({ error: "Erreur serveur lors de la création de l'utilisateur." });
        }
    }

    // ✅ Mise à jour d'un utilisateur
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { nom_utilisateur, email, mot_de_passe, role } = req.body;

            const user = await UtilisateurModel.findByPk(id);
            if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

            // Mise à jour des données utilisateur
            let updatedData = { nom_utilisateur, email, role };
            if (mot_de_passe) {
                updatedData.mot_de_passe = await bcrypt.hash(mot_de_passe, 10); // 🔐 Hachage du mot de passe si fourni
            }

            await user.update(updatedData);
            res.json({ message: "Utilisateur mis à jour avec succès.", user });
        } catch (err) {
            console.error("💥 Erreur serveur lors de la mise à jour de l'utilisateur :", err);
            res.status(500).json({ error: "Erreur serveur lors de la mise à jour de l'utilisateur." });
        }
    }

    // ✅ Suppression d'un utilisateur
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;

            const user = await UtilisateurModel.findByPk(id);
            if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

            await user.destroy();
            res.json({ message: "Utilisateur supprimé avec succès" });
        } catch (err) {
            console.error("💥 Erreur serveur lors de la suppression de l'utilisateur :", err);
            res.status(500).json({ error: "Erreur serveur lors de la suppression de l'utilisateur." });
        }
    }
}

module.exports = UtilisateurController;
