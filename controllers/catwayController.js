/**
 * @fileoverview Contrôleur pour la gestion des catways
 * @module controllers/catwayController
 */

const Catway = require("../models/Catway");

/**
 * Récupère tous les catways (GET /api/catways)
 * @async
 * @function getAllCatways
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Liste des catways triés par numéro
 */
const getAllCatways = async (req, res) => {
  try {
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    res.status(200).json({
      success: true,
      count: catways.length,
      data: catways,
    });
  } catch (error) {
    console.error("❌ Erreur getAllCatways :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des catways",
    });
  }
};

/**
 * Récupère un catway par son numéro (GET /api/catways/:id)
 * @async
 * @function getCatwayByNumber
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Détails du catway
 */
const getCatwayByNumber = async (req, res) => {
  try {
    const { id } = req.params; // id = catwayNumber
    const catway = await Catway.findOne({ catwayNumber: parseInt(id) });

    if (!catway) {
      return res.status(404).json({
        success: false,
        message: "Catway non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      data: catway,
    });
  } catch (error) {
    console.error("❌ Erreur getCatwayByNumber :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération du catway",
    });
  }
};

/**
 * Crée un nouveau catway (POST /api/catways)
 * @async
 * @function createCatway
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Catway créé
 */
const createCatway = async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;

    // Validation des entrées
    if (!catwayNumber || !catwayType || !catwayState) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }

    // Vérifier si le numéro existe déjà
    const existingCatway = await Catway.findOne({ catwayNumber });
    if (existingCatway) {
      return res.status(400).json({
        success: false,
        message: "Ce numéro de catway existe déjà",
      });
    }

    const newCatway = await Catway.create({
      catwayNumber,
      catwayType,
      catwayState,
    });

    res.status(201).json({
      success: true,
      message: "Catway créé avec succès",
      data: newCatway,
    });
  } catch (error) {
    console.error("❌ Erreur createCatway :", error);

    // Gestion des erreurs de validation Mongoose
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
      message: "Erreur serveur lors de la création du catway",
    });
  }
};

/**
 * Met à jour un catway existant (PUT /api/catways/:id)
 * @async
 * @function updateCatway
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Catway mis à jour
 */
const updateCatway = async (req, res) => {
  try {
    const { id } = req.params; // id = catwayNumber
    const { catwayState } = req.body; // Seul catwayState est modifiable selon le brief

    if (!catwayState) {
      return res.status(400).json({
        success: false,
        message: "L'état du catway est requis",
      });
    }

    const updatedCatway = await Catway.findOneAndUpdate(
      { catwayNumber: parseInt(id) },
      { catwayState },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCatway) {
      return res.status(404).json({
        success: false,
        message: "Catway non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Catway mis à jour",
      data: updatedCatway,
    });
  } catch (error) {
    console.error("❌ Erreur updateCatway :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour du catway",
    });
  }
};

/**
 * Supprime un catway (DELETE /api/catways/:id)
 * @async
 * @function deleteCatway
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Message de confirmation
 */
const deleteCatway = async (req, res) => {
  try {
    const { id } = req.params; // id = catwayNumber

    const deleted = await Catway.findOneAndDelete({
      catwayNumber: parseInt(id),
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Catway non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Catway supprimé avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur deleteCatway :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la suppression du catway",
    });
  }
};

module.exports = {
  getAllCatways,
  getCatwayByNumber,
  createCatway,
  updateCatway,
  deleteCatway,
};
