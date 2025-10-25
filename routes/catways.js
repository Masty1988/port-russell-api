const express = require("express");
const router = express.Router();
const {
  getAllCatways,
  getCatwayByNumber,
  createCatway,
  updateCatway,
  deleteCatway,
} = require("../controllers/catwayController");

// Routes NON protégées (utilisées par le frontend avec sessions)
// Les pages sont déjà protégées par protectPage dans server.js
router.get("/", getAllCatways);
router.get("/:id", getCatwayByNumber);
router.post("/", createCatway);
router.put("/:id", updateCatway);
router.delete("/:id", deleteCatway);

module.exports = router;
