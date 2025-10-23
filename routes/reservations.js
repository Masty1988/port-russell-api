/**
 * @fileoverview Routes pour les réservations
 * @module routes/reservation.routes
 */

const express = require("express");
const router = express.Router();
const {
  getAllReservations,
  createReservation,
  updateReservation,
  deleteReservation,
} = require("../controllers/reservationController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, getAllReservations);
router.post("/", verifyToken, createReservation);
router.put("/:id", verifyToken, updateReservation);
router.delete("/:id", verifyToken, deleteReservation);

module.exports = router;
