# 📚 Documentation API - Port Russell

API REST privée pour la gestion des catways et réservations du port de plaisance Russell.

**Base URL :** `http://localhost:3000/api` (développement)

---

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour sécuriser les endpoints.

### POST /login

Connexion d'un utilisateur.

**Body :**

```json
{
  "email": "user@example.com",
  "password": "motdepasse"
}
```

**Réponse (200) :**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "John Doe",
    "email": "user@example.com"
  }
}
```

### GET /logout

Déconnexion de l'utilisateur.

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

---

## 🚢 Catways

### GET /catways

Récupère tous les catways.

**Headers :**

```
Authorization: Bearer {token}
```

**Réponse (200) :**

```json
{
  "success": true,
  "count": 24,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "catwayNumber": 1,
      "catwayType": "long",
      "catwayState": "Bon état",
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

### GET /catways/:id

Récupère un catway par son numéro.

**Paramètres :**

- `id` : Numéro du catway

**Réponse (200) :**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "catwayNumber": 1,
    "catwayType": "long",
    "catwayState": "Bon état"
  }
}
```

### POST /catways

Crée un nouveau catway.

**Body :**

```json
{
  "catwayNumber": 25,
  "catwayType": "short",
  "catwayState": "Neuf - Excellent état"
}
```

**Réponse (201) :**

```json
{
  "success": true,
  "message": "Catway créé avec succès",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "catwayNumber": 25,
    "catwayType": "short",
    "catwayState": "Neuf - Excellent état"
  }
}
```

### PUT /catways/:id

Met à jour l'état d'un catway (seul le champ `catwayState` est modifiable).

**Body :**

```json
{
  "catwayState": "Réparation nécessaire"
}
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Catway mis à jour",
  "data": {
    "catwayNumber": 1,
    "catwayType": "long",
    "catwayState": "Réparation nécessaire"
  }
}
```

### DELETE /catways/:id

Supprime un catway.

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Catway supprimé avec succès"
}
```

---

## 📋 Réservations

### GET /reservations

Récupère toutes les réservations.

**Réponse (200) :**

```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "catwayNumber": 5,
      "clientName": "Jean Dupont",
      "boatName": "Le Marin",
      "startDate": "2025-01-20T00:00:00.000Z",
      "endDate": "2025-01-25T00:00:00.000Z"
    }
  ]
}
```

### GET /catways/:id/reservations

Récupère toutes les réservations d'un catway spécifique.

**Paramètres :**

- `id` : Numéro du catway

### GET /catways/:id/reservations/:idReservation

Récupère les détails d'une réservation spécifique.

**Paramètres :**

- `id` : Numéro du catway
- `idReservation` : ID de la réservation (ObjectId MongoDB)

### POST /catways/:id/reservations

Crée une nouvelle réservation pour un catway.

**Body :**

```json
{
  "clientName": "Marie Martin",
  "boatName": "L'Aventurier",
  "startDate": "2025-02-01",
  "endDate": "2025-02-10"
}
```

**Réponse (201) :**

```json
{
  "success": true,
  "message": "Réservation créée avec succès",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "catwayNumber": 5,
    "clientName": "Marie Martin",
    "boatName": "L'Aventurier",
    "startDate": "2025-02-01T00:00:00.000Z",
    "endDate": "2025-02-10T00:00:00.000Z"
  }
}
```

### PUT /catways/:id/reservations/:idReservation

Met à jour une réservation existante.

**Body :**

```json
{
  "clientName": "Marie Martin-Dubois",
  "boatName": "L'Aventurier II",
  "startDate": "2025-02-02",
  "endDate": "2025-02-12"
}
```

### DELETE /catways/:id/reservations/:idReservation

Supprime une réservation.

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Réservation supprimée avec succès"
}
```

---

## 👥 Utilisateurs

### GET /users

Récupère tous les utilisateurs (sans les mots de passe).

**Réponse (200) :**

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "username": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

### GET /users/:email

Récupère un utilisateur par son email.

**Paramètres :**

- `email` : Adresse email de l'utilisateur

### POST /users

Crée un nouvel utilisateur.

**Body :**

```json
{
  "username": "Alice Wonder",
  "email": "alice@example.com",
  "password": "password123"
}
```

**Réponse (201) :**

```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "username": "Alice Wonder",
    "email": "alice@example.com"
  }
}
```

### PUT /users/:email

Met à jour un utilisateur (le mot de passe est optionnel).

**Body :**

```json
{
  "username": "Alice Wonderland",
  "password": "newpassword456"
}
```

### DELETE /users/:email

Supprime un utilisateur.

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Utilisateur supprimé avec succès"
}
```

---

## 🚨 Codes d'erreur

| Code | Signification                                        |
| ---- | ---------------------------------------------------- |
| 200  | Succès                                               |
| 201  | Ressource créée                                      |
| 400  | Requête invalide (données manquantes ou incorrectes) |
| 401  | Non autorisé (token manquant ou invalide)            |
| 404  | Ressource non trouvée                                |
| 409  | Conflit (ex: email déjà utilisé)                     |
| 500  | Erreur serveur                                       |

---

## 📝 Notes

- Tous les endpoints (sauf `/login` et `/logout`) nécessitent un token JWT valide
- Les dates doivent être au format ISO 8601 (`YYYY-MM-DD`)
- Le champ `catwayType` accepte uniquement `"long"` ou `"short"`
- Les mots de passe sont automatiquement hashés avec bcrypt
