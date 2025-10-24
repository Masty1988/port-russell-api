/**
 * @fileoverview Routes d'authentification
 * @module routes/auth
 */

const express = require("express");
const router = express.Router();
const { login, logout } = require("../controllers/authController");

/**
 * @route POST /login
 * @description Connexion d'un utilisateur
 * @access Public
 */
router.post("/login", login);

/**
 * @route GET /logout
 * @description Déconnexion d'un utilisateur
 * @access Private
 */
router.get("/logout", logout);

module.exports = router;
