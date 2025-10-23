/**
 * @fileoverview Routes pour les catways
 * @module routes/catway.routes
 */

const express = require("express");
const router = express.Router();
const {
  getAllCatways,
  createCatway,
  updateCatway,
  deleteCatway,
} = require("../controllers/catwayController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, getAllCatways);
router.post("/", verifyToken, createCatway);
router.put("/:id", verifyToken, updateCatway);
router.delete("/:id", verifyToken, deleteCatway);

module.exports = router;
