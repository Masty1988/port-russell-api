/**
 * @fileoverview Middleware d'authentification JWT
 * @module middleware/auth
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware de protection des routes (API)
 * Vérifie la présence et validité du token JWT
 * @function protect
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 * @returns {void}
 */
const protect = async (req, res, next) => {
  let token;

  // Récupération du token depuis le header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extraction du token
      token = req.headers.authorization.split(" ")[1];

      // Vérification et décodage du token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Ajout de l'utilisateur à la requête (sans le mot de passe)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Utilisateur non trouvé",
        });
      }

      next();
    } catch (error) {
      console.error("Erreur d'authentification:", error.message);
      return res.status(401).json({
        success: false,
        message: "Token invalide ou expiré",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Non autorisé, token manquant",
    });
  }
};

/**
 * Middleware de protection des pages (frontend)
 * Vérifie la présence d'un utilisateur en session
 * @function protectPage
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 * @returns {void}
 */
const protectPage = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.redirect("/");
  }
};

/**
 * Middleware pour rediriger les utilisateurs connectés
 * @function redirectIfAuthenticated
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 * @returns {void}
 */
const redirectIfAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect("/dashboard");
  }
  next();
};

module.exports = { protect, protectPage, redirectIfAuthenticated };
