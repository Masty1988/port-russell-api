/**
 * @fileoverview Modèle Mongoose pour les utilisateurs
 * @module models/User
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * Schéma utilisateur pour la capitainerie
 * @typedef {Object} UserSchema
 * @property {string} username - Nom d'utilisateur
 * @property {string} email - Adresse email (unique)
 * @property {string} password - Mot de passe hashé
 * @property {Date} createdAt - Date de création
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Le nom d'utilisateur est requis"],
    trim: true,
    minlength: [3, "Le nom doit contenir au moins 3 caractères"],
  },
  email: {
    type: String,
    required: [true, "L'email est requis"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Email invalide"],
  },
  password: {
    type: String,
    required: [true, "Le mot de passe est requis"],
    minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Middleware pre-save : Hash le mot de passe avant sauvegarde
 * @function
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Méthode pour comparer les mots de passe
 * @method comparePassword
 * @param {string} candidatePassword - Mot de passe à vérifier
 * @returns {Promise<boolean>} True si le mot de passe correspond
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Erreur lors de la comparaison des mots de passe");
  }
};

module.exports = mongoose.model("User", userSchema);
