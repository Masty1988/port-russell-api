/**
 * @fileoverview Contrôleur pour la gestion des utilisateurs
 * @module controllers/userController
 */

const User = require("../models/User");

/**
 * Récupère tous les utilisateurs (GET /api/users)
 * @async
 * @function getAllUsers
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Liste des utilisateurs
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclut le mot de passe
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("❌ Erreur getAllUsers :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des utilisateurs",
    });
  }
};

/**
 * Crée un nouvel utilisateur (POST /api/users)
 * @async
 * @function createUser
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Utilisateur créé
 */
const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email déjà utilisé",
      });
    }

    const newUser = await User.create({ username, email, password });

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("❌ Erreur createUser :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la création de l'utilisateur",
    });
  }
};

/**
 * Met à jour un utilisateur (PUT /api/users/:id)
 * @async
 * @function updateUser
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Utilisateur mis à jour
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Utilisateur mis à jour",
      data: updatedUser,
    });
  } catch (error) {
    console.error("❌ Erreur updateUser :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour de l'utilisateur",
    });
  }
};

/**
 * Supprime un utilisateur (DELETE /api/users/:id)
 * @async
 * @function deleteUser
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Message de confirmation
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur deleteUser :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la suppression de l'utilisateur",
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
