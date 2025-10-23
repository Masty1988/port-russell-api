/**
 * @fileoverview Modèle Mongoose pour les catways (appontements)
 * @module models/Catway
 */

const mongoose = require("mongoose");

/**
 * Schéma catway pour le port de plaisance
 * @typedef {Object} CatwaySchema
 * @property {number} catwayNumber - Numéro unique du catway
 * @property {string} catwayType - Type ("long" ou "short")
 * @property {string} catwayState - Description de l'état
 */
const catwaySchema = new mongoose.Schema(
  {
    catwayNumber: {
      type: Number,
      required: [true, "Le numéro de catway est requis"],
      unique: true,
      min: [1, "Le numéro doit être positif"],
    },
    catwayType: {
      type: String,
      required: [true, "Le type de catway est requis"],
      enum: {
        values: ["long", "short"],
        message: 'Le type doit être "long" ou "short"',
      },
    },
    catwayState: {
      type: String,
      required: [true, "L'état du catway est requis"],
      trim: true,
      maxlength: [500, "La description ne peut pas dépasser 500 caractères"],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Index pour recherche rapide par numéro
 */
catwaySchema.index({ catwayNumber: 1 });

module.exports = mongoose.model("Catway", catwaySchema);
