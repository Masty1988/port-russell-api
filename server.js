const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const catwayRoutes = require("./routes/catway.routes");
const reservationRoutes = require("./routes/reservation.routes");
const userRoutes = require("./routes/user.routes");

app.use("/api/catways", catwayRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/users", userRoutes);
