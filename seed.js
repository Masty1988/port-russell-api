/**
 * @fileoverview Script d'importation des données de test
 * @module seed
 */

const mongoose = require("mongoose");
const Catway = require("./models/Catway");
const Reservation = require("./models/Reservation");
const fs = require("fs");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connexion MongoDB réussie"))
  .catch((err) => console.error("❌ Erreur MongoDB :", err.message));

const importData = async () => {
  try {
    const catways = JSON.parse(fs.readFileSync("./data/catways.json", "utf-8"));
    const reservations = JSON.parse(
      fs.readFileSync("./data/reservations.json", "utf-8")
    );

    await Catway.deleteMany();
    await Reservation.deleteMany();

    await Catway.insertMany(catways);
    await Reservation.insertMany(reservations);

    console.log("✅ Données importées avec succès");
    process.exit();
  } catch (err) {
    console.error("❌ Erreur importation :", err.message);
    process.exit(1);
  }
};

importData();
