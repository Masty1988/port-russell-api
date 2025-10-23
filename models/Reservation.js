/**
 * @fileoverview Modèle Mongoose pour les réservations
 * @module models/Reservation
 */

const mongoose = require("mongoose");

/**
 * Schéma réservation pour les catways
 * @typedef {Object} ReservationSchema
 * @property {number} catwayNumber - Numéro du catway réservé
 * @property {string} clientName - Nom du client
 * @property {string} boatName - Nom du bateau
 * @property {Date} startDate - Date de début
 * @property {Date} endDate - Date de fin
 */
const reservationSchema = new mongoose.Schema(
  {
    catwayNumber: {
      type: Number,
      required: [true, "Le numéro de catway est requis"],
      ref: "Catway",
    },
    clientName: {
      type: String,
      required: [true, "Le nom du client est requis"],
      trim: true,
      minlength: [2, "Le nom doit contenir au moins 2 caractères"],
    },
    boatName: {
      type: String,
      required: [true, "Le nom du bateau est requis"],
      trim: true,
      minlength: [2, "Le nom du bateau doit contenir au moins 2 caractères"],
    },
    startDate: {
      type: Date,
      required: [true, "La date de début est requise"],
    },
    endDate: {
      type: Date,
      required: [true, "La date de fin est requise"],
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "La date de fin doit être après la date de début",
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Index composé pour recherches par catway et dates
 */
reservationSchema.index({ catwayNumber: 1, startDate: 1 });

/**
 * Méthode pour vérifier si une réservation est en cours
 * @method isActive
 * @returns {boolean} True si la réservation est active
 */
reservationSchema.methods.isActive = function () {
  const now = new Date();
  return this.startDate <= now && this.endDate >= now;
};

module.exports = mongoose.model("Reservation", reservationSchema);
