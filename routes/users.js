/**
 * @fileoverview Routes pour les utilisateurs
 * @module routes/user.routes
 */

const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, getAllUsers);
router.post("/", verifyToken, createUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);

module.exports = router;
