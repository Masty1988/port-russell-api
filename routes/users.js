/**
 * @fileoverview Routes pour la gestion des utilisateurs
 * @module routes/users
 */

const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.get("/", getAllUsers);
router.get("/:email", getUserByEmail);
router.post("/", createUser);
router.put("/:email", updateUser);
router.delete("/:email", deleteUser);

module.exports = router;
