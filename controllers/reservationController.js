/**
 * @fileoverview Contrôleur pour la gestion des réservations
 * @module controllers/reservationController
 */

const Reservation = require("../models/Reservation");
const Catway = require("../models/Catway");

/**
 * Récupère toutes les réservations (GET /api/reservations)
 * @async
 * @function getAllReservations
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Liste des réservations triées par date
 */
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ startDate: -1 });
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    console.error("❌ Erreur getAllReservations :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des réservations",
    });
  }
};

/**
 * Récupère les réservations d'un catway (GET /api/catways/:id/reservations)
 * @async
 * @function getReservationsByCatway
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Liste des réservations du catway
 */
const getReservationsByCatway = async (req, res) => {
  try {
    const { id } = req.params; // id = catwayNumber

    const reservations = await Reservation.find({
      catwayNumber: parseInt(id),
    }).sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    console.error("❌ Erreur getReservationsByCatway :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des réservations",
    });
  }
};

/**
 * Récupère une réservation spécifique (GET /api/catways/:id/reservations/:idReservation)
 * @async
 * @function getReservationById
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Détails de la réservation
 */
const getReservationById = async (req, res) => {
  try {
    const { id, idReservation } = req.params;

    const reservation = await Reservation.findOne({
      _id: idReservation,
      catwayNumber: parseInt(id),
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Réservation non trouvée",
      });
    }

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    console.error("❌ Erreur getReservationById :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération de la réservation",
    });
  }
};

/**
 * Crée une nouvelle réservation (POST /api/catways/:id/reservations)
 * @async
 * @function createReservation
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Réservation créée
 */
const createReservation = async (req, res) => {
  try {
    const { id } = req.params; // catwayNumber
    const { clientName, boatName, startDate, endDate } = req.body;

    // Validation des entrées
    if (!clientName || !boatName || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }

    // Vérifier que le catway existe
    const catway = await Catway.findOne({ catwayNumber: parseInt(id) });
    if (!catway) {
      return res.status(404).json({
        success: false,
        message: "Catway non trouvé",
      });
    }

    // Vérifier que les dates sont valides
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "La date de fin doit être après la date de début",
      });
    }

    // Créer la réservation
    const newReservation = await Reservation.create({
      catwayNumber: parseInt(id),
      clientName,
      boatName,
      startDate: start,
      endDate: end,
    });

    res.status(201).json({
      success: true,
      message: "Réservation créée avec succès",
      data: newReservation,
    });
  } catch (error) {
    console.error("❌ Erreur createReservation :", error);

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
      message: "Erreur serveur lors de la création de la réservation",
    });
  }
};

/**
 * Met à jour une réservation (PUT /api/catways/:id/reservations/:idReservation)
 * @async
 * @function updateReservation
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Réservation mise à jour
 */
const updateReservation = async (req, res) => {
  try {
    const { id, idReservation } = req.params;
    const updates = req.body;

    // Validation des dates si elles sont modifiées
    if (updates.startDate && updates.endDate) {
      const start = new Date(updates.startDate);
      const end = new Date(updates.endDate);

      if (end <= start) {
        return res.status(400).json({
          success: false,
          message: "La date de fin doit être après la date de début",
        });
      }
    }

    const updatedReservation = await Reservation.findOneAndUpdate(
      { _id: idReservation, catwayNumber: parseInt(id) },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedReservation) {
      return res.status(404).json({
        success: false,
        message: "Réservation non trouvée",
      });
    }

    res.status(200).json({
      success: true,
      message: "Réservation mise à jour",
      data: updatedReservation,
    });
  } catch (error) {
    console.error("❌ Erreur updateReservation :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour de la réservation",
    });
  }
};

/**
 * Supprime une réservation (DELETE /api/catways/:id/reservations/:idReservation)
 * @async
 * @function deleteReservation
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Message de confirmation
 */
const deleteReservation = async (req, res) => {
  try {
    const { id, idReservation } = req.params;

    const deleted = await Reservation.findOneAndDelete({
      _id: idReservation,
      catwayNumber: parseInt(id),
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Réservation non trouvée",
      });
    }

    res.status(200).json({
      success: true,
      message: "Réservation supprimée avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur deleteReservation :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la suppression de la réservation",
    });
  }
};

module.exports = {
  getAllReservations,
  getReservationsByCatway,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
};
