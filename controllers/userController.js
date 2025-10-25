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
 * Récupère un utilisateur par email (GET /api/users/:email)
 * @async
 * @function getUserByEmail
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Détails de l'utilisateur
 */
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("❌ Erreur getUserByEmail :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération de l'utilisateur",
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

    // Validation des entrées
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }

    // Vérifier si l'email existe déjà
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Cet email est déjà utilisé",
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

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((e) => e.message)
          .join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la création de l'utilisateur",
    });
  }
};

/**
 * Met à jour un utilisateur (PUT /api/users/:email)
 * @async
 * @function updateUser
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Utilisateur mis à jour
 */
const updateUser = async (req, res) => {
  try {
    const { email } = req.params;
    const updates = req.body;

    // Si on veut changer le mot de passe, il sera re-hashé par le pre-save hook
    // Sinon, on l'exclut des updates
    if (updates.password && updates.password.trim() === "") {
      delete updates.password;
    }

    // Ne pas permettre de changer l'email via cette route pour éviter les conflits
    delete updates.email;

    const updatedUser = await User.findOneAndUpdate({ email }, updates, {
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
 * Supprime un utilisateur (DELETE /api/users/:email)
 * @async
 * @function deleteUser
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Message de confirmation
 */
const deleteUser = async (req, res) => {
  try {
    const { email } = req.params;

    const deleted = await User.findOneAndDelete({ email });

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
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};
