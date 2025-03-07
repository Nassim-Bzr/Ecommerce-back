const jwt = require("jsonwebtoken");

const authorize = (roles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Accès non autorisée. Aucun token fourni." });
      }

      // Extraire et vérifier le token
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET , "SECRET_KEY");

      // Vérifier si l'utilisateur a le bon rôle
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Accès refusé. Vous n'avez pas les permissions nécessaires." });
      }

      req.user = decoded; // Ajouter les infos utilisateur à la requête
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token invalide ou expiré." });
    }
  };
};

module.exports = authorize;
