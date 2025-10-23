/**
 * @fileoverview Configuration de la connexion à MongoDB
 * @module config/db
 */

const mongoose = require("mongoose");

/**
 * Établit la connexion à la base de données MongoDB
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 * @throws {Error} Si la connexion échoue
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Erreur de connexion MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
