/**
 * @fileoverview Contrôleur pour l'authentification
 * @module controllers/authController
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Génère un token JWT
 * @function generateToken
 * @param {string} id - ID de l'utilisateur
 * @returns {string} Token JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/**
 * Connexion d'un utilisateur (POST /login)
 * @async
 * @function login
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} JSON avec token et infos utilisateur
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation des entrées
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis",
      });
    }

    // Recherche de l'utilisateur
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Identifiants invalides",
      });
    }

    // Vérification du mot de passe
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Identifiants invalides",
      });
    }

    // Génération du token
    const token = generateToken(user._id);

    // Stockage en session pour le frontend
    req.session.userId = user._id;
    req.session.userEmail = user.email;
    req.session.username = user.username;

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la connexion",
    });
  }
};

/**
 * Déconnexion d'un utilisateur (GET /logout)
 * @function logout
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Redirection ou JSON
 */
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur logout:", err);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la déconnexion",
      });
    }
    res.clearCookie("connect.sid");

    // Si requête API, retourne JSON, sinon redirige
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.status(200).json({
        success: true,
        message: "Déconnexion réussie",
      });
    }

    res.redirect("/");
  });
};

module.exports = { login, logout };
