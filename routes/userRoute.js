const express = require("express");
const router = express.Router();
const UtilisateurController = require("../controllers/userController");
const authorize = require("../middlewares/authorize"); // 🔥 Import du middleware

// ✅ Routes accessibles à tous (PUBLIC)
router.post("/signup", UtilisateurController.createUser);
router.post("/login", UtilisateurController.loginUser);

// 🔒 Routes accessibles uniquement aux administrateurs
router.get("/",  UtilisateurController.getAllUsers);
router.get("/:id",  UtilisateurController.getUserById);
router.put("/:id",  UtilisateurController.updateUser);
router.delete("/:id",  UtilisateurController.deleteUser);

module.exports = router;
