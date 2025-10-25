# 🚢 Port Russell - API de Gestion

API REST pour la gestion des catways et réservations du port de plaisance Russell.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)

## 📋 Description

Application web complète permettant à la capitainerie du port Russell de gérer :

- Les catways (appontements)
- Les réservations
- Les utilisateurs

## 🚀 Technologies utilisées

- **Backend** : Node.js, Express.js
- **Base de données** : MongoDB (Mongoose)
- **Authentification** : JWT (JSON Web Tokens) + Sessions
- **Template Engine** : EJS
- **Sécurité** : bcrypt pour le hashing des mots de passe
- **Documentation** : JSDoc

## 📦 Installation

### Prérequis

- Node.js (v18 ou supérieur)
- npm
- Compte MongoDB Atlas

### Étapes

1. **Cloner le repository**

```bash
git clone https://github.com/VOTRE_USERNAME/port-russell-api.git
cd port-russell-api
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

Créer un fichier `.env` à la racine du projet :

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/test?retryWrites=true&w=majority
JWT_SECRET=votre_secret_jwt_ultra_securise_de_32_caracteres_minimum
PORT=3000
NODE_ENV=development
```

4. **Importer les données de test (optionnel)**

Si vous avez les fichiers `catways.json` et `reservations.json` :

```bash
mongoimport --uri "VOTRE_MONGODB_URI" --collection catways --file catways.json --jsonArray
mongoimport --uri "VOTRE_MONGODB_URI" --collection reservations --file reservations.json --jsonArray
```

5. **Créer un utilisateur initial**

Vous pouvez créer un utilisateur via l'API ou directement dans MongoDB.

6. **Lancer l'application**

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 📖 Documentation

### Documentation API

Accessible à l'adresse : `http://localhost:3000/api-docs`

Ou consultez le fichier [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Routes principales

#### Frontend (Interface utilisateur)

- `/` - Page d'accueil et connexion
- `/dashboard` - Tableau de bord
- `/catways` - Gestion des catways
- `/reservations` - Gestion des réservations
- `/users` - Gestion des utilisateurs

#### API (JSON)

- `POST /api/login` - Connexion
- `GET /api/logout` - Déconnexion
- `GET /api/catways` - Liste des catways
- `GET /api/reservations` - Liste des réservations
- `GET /api/users` - Liste des utilisateurs

## 🗂️ Structure du projet

```
port-russell-api/
├── config/
│   └── db.js                 # Configuration MongoDB
├── controllers/
│   ├── authController.js     # Logique d'authentification
│   ├── catwayController.js   # Logique catways
│   ├── reservationController.js
│   └── userController.js
├── middleware/
│   └── auth.js               # Middlewares d'authentification
├── models/
│   ├── User.js               # Schéma utilisateur
│   ├── Catway.js             # Schéma catway
│   └── Reservation.js        # Schéma réservation
├── routes/
│   ├── auth.js               # Routes authentification
│   ├── catways.js            # Routes catways
│   ├── reservations.js       # Routes réservations
│   └── users.js              # Routes utilisateurs
├── views/
│   ├── layout.ejs            # Template principal
│   ├── index.ejs             # Page d'accueil
│   ├── dashboard.ejs         # Tableau de bord
│   ├── catways.ejs           # Gestion catways
│   ├── reservations.ejs      # Gestion réservations
│   ├── users.ejs             # Gestion utilisateurs
│   └── api-docs.ejs          # Documentation API
├── public/
│   └── css/
│       └── style.css         # Styles CSS
├── .env                      # Variables d'environnement (non versionné)
├── .gitignore
├── server.js                 # Point d'entrée de l'application
├── package.json
├── README.md
└── API_DOCUMENTATION.md
```

## 🔐 Sécurité

- Mots de passe hashés avec bcrypt (salt rounds: 10)
- Authentification JWT pour l'API
- Sessions sécurisées pour le frontend
- Validation des entrées côté serveur
- Protection CSRF via httpOnly cookies

## 🧪 Tests

Pour tester l'API avec Postman ou curl :

```bash
# Connexion
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Récupérer les catways (avec le token reçu)
curl http://localhost:3000/api/catways \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

## 🌐 Déploiement

L'application est déployée sur Render : [Lien à venir]

## 👤 Auteur

**Votre Nom**

- GitHub: [@Masty1988](https://github.com/Masty1988)

## 📝 Licence

Ce projet est réalisé dans le cadre d'une formation de développeur web.

## 🙏 Remerciements

- Formation CEF Learning
- MongoDB Atlas
- Render.com pour l'hébergement
