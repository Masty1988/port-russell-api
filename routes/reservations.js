/**
 * @fileoverview Routes pour la gestion des réservations
 * @module routes/reservations
 */

const express = require("express");
const router = express.Router();
const {
  getAllReservations,
  getReservationsByCatway,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
} = require("../controllers/reservationController");

// Route globale : toutes les réservations
router.get("/", getAllReservations);

// Routes sous-ressource catways (à monter sur /api/catways dans server.js)
// Ces routes seront accessibles via /api/catways/:id/reservations
router.get("/:id/reservations", getReservationsByCatway);
router.get("/:id/reservations/:idReservation", getReservationById);
router.post("/:id/reservations", createReservation);
router.put("/:id/reservations/:idReservation", updateReservation);
router.delete("/:id/reservations/:idReservation", deleteReservation);

module.exports = router;
