/**
 * @fileoverview Contrôleur pour la gestion des réservations
 * @module controllers/reservationController
 */

const Reservation = require("../models/Reservation");

/**
 * Récupère toutes les réservations (GET /api/reservations)
 * @async
 * @function getAllReservations
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Liste des réservations
 */
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user", "username email")
      .populate("catway", "catwayNumber catwayType");

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
 * Crée une nouvelle réservation (POST /api/reservations)
 * @async
 * @function createReservation
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Réservation créée
 */
const createReservation = async (req, res) => {
  try {
    const { user, catway, startDate, endDate } = req.body;

    if (!user || !catway || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }

    const newReservation = await Reservation.create({
      user,
      catway,
      startDate,
      endDate,
    });

    res.status(201).json({
      success: true,
      message: "Réservation créée avec succès",
      data: newReservation,
    });
  } catch (error) {
    console.error("❌ Erreur createReservation :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la création de la réservation",
    });
  }
};

/**
 * Met à jour une réservation (PUT /api/reservations/:id)
 * @async
 * @function updateReservation
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Réservation mise à jour
 */
const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
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
 * Supprime une réservation (DELETE /api/reservations/:id)
 * @async
 * @function deleteReservation
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Message de confirmation
 */
const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Reservation.findByIdAndDelete(id);

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
  createReservation,
  updateReservation,
  deleteReservation,
};
