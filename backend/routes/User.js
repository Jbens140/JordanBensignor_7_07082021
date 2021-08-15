const express       = require("express");
const router        = express.Router();
const userCtrl      = require("../controllers/usersCtrl");
const auth          = require('../middleware/auth'); 

router.get("/all/",              userCtrl.findAllUsers)

router.get("/:id",               userCtrl.findOneUser)

router.delete("/",      auth,    userCtrl.deleteOneUser)

router.delete("/:id",   auth,    userCtrl.deleteMyAccount)

module.exports = router



















// const express = require('express');
// const router = express.Router();

// // On associe les fonctions aux différentes routes, on importe le controller
// const userCtrl = require('../controllers/Users');

// const verifyPassword = require('../middleware/verifyPassword');

// const multer = require("../middleware/multer-config")

// // Création des routes Inscription et Connexion de l'API avec les middlewares

// router.post('/signup', verifyPassword, userCtrl.signup); // Crée un nouvel utilisateur

// // Vérifie les informations d'identification de l'utilisateur, enrenvoyant l'identifiant userID depuis la base de données
// router.post('/login', userCtrl.login); // Connecte un utilisateur

// module.exports = router;