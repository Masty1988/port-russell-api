/**
 * @fileoverview Point d'entrée principal de l'application
 * @module server
 */

const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const path = require("path");
const connectDB = require("./config/db");

// Configuration des variables d'environnement
dotenv.config();

// Connexion à MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARES ====================

// Parser JSON et URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fichiers statiques (CSS, images, JS client)
app.use(express.static(path.join(__dirname, "public")));

// Configuration des sessions (pour le frontend)
app.use(
  session({
    secret: process.env.JWT_SECRET || "secret_temporaire_a_changer",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // true en prod (HTTPS)
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 jours
    },
  })
);

// Moteur de templates EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware pour rendre les données de session disponibles dans toutes les vues
app.use((req, res, next) => {
  res.locals.user = req.session.userId
    ? {
        id: req.session.userId,
        email: req.session.userEmail,
        username: req.session.username,
      }
    : null;
  next();
});

// ==================== ROUTES API ====================

const catwayRoutes = require("./routes/catway.routes");
const reservationRoutes = require("./routes/reservation.routes");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth");

app.use("/api/catways", catwayRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/users", userRoutes);
app.use("/api", authRoutes); // Pour /api/login et /api/logout

// ==================== ROUTES FRONTEND ====================

const { redirectIfAuthenticated, protectPage } = require("./middleware/auth");

// Page d'accueil (avec formulaire de connexion)
app.get("/", redirectIfAuthenticated, (req, res) => {
  res.render("index");
});

// Dashboard (protégé)
app.get("/dashboard", protectPage, async (req, res) => {
  try {
    const Reservation = require("./models/Reservation");

    // Récupère les réservations en cours
    const now = new Date();
    const activeReservations = await Reservation.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ startDate: 1 });

    res.render("dashboard", {
      activeReservations,
      currentDate: now.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    });
  } catch (error) {
    console.error("Erreur dashboard:", error);
    res.status(500).send("Erreur serveur");
  }
});

// Pages CRUD (protégées)
app.get("/catways", protectPage, (req, res) => {
  res.render("catways");
});

app.get("/reservations", protectPage, (req, res) => {
  res.render("reservations");
});

app.get("/users", protectPage, (req, res) => {
  res.render("users");
});

// Logout (frontend)
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur logout:", err);
    }
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

// ==================== GESTION D'ERREURS ====================

// Route 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route non trouvée",
  });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Erreur serveur interne",
  });
});

// ==================== DÉMARRAGE DU SERVEUR ====================

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
