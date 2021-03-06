const express = require('express'); // Importation d'express => Framework basé sur node.js
const bodyParser = require('body-parser'); // Permet d'extraire l'objet JSON des requêtes POST
const nocache = require("nocache"); //Désactive la mise en cache du navigateur
const helmet = require("helmet");// il sécurise nos requêtes HTTP
const cors = require('cors'); // cors: manage cross-origin resource sharing
const path = require('path'); // Plugin qui sert dans l'upload des images et permet de travailler avec les répertoires et chemin de fichier
const auth = require("./middleware/auth")

const dataBase      = require("./models");


// On importe la route dédiée aux utilisateurs
const userRoutes = require('./routes/user');
// On importe la route dédiée aux autentification
const authRoutes    = require("./routes/auth")
// On importe la route dédiée aux m
const messageRoutes = require("./routes/message")
// On importe la route dédiée aux utilisateurs
const commentRoutes = require("./routes/comment")

require("dotenv").config();


// L'application utilise le framework express
  const app = express();

// il sécurise nos requêtes HTTP
app.use(helmet());


//Désactive la mise en cache du navigateur
app.use(nocache());

// Midleware qui permet de charger les fichiers qui sont dans le repertoire images
app.use('/images', express.static(path.join(__dirname, 'images')));


// Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS
app.use((req, res, next) => {
  // on indique que les ressources peuvent être partagées depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
 // on indique les entêtes qui seront utilisées après la pré-vérification cross-origin afin de donner l'autorisation
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
// on indique les méthodes autorisées pour les requêtes HTTP
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  // on autorise ce serveur à fournir des scripts pour la page visitée
  // res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors()); // CORS - partage de ressources entre serveurs

// On utilise une méthode body-parser pour la transformation du corps de la requête en JSON.

// Transforme les données arrivant de la requête POST en un objet JSON.
app.use(bodyParser.json())

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());


dataBase.sequelize.sync()   // Synchronisation de la base de données grâce à Sequelize
.then(() => {
  console.log("Connection à la base de données msql réussi.");
})
.catch((err) => {
  console.error("Impossible de se connecté à la base de donnée:", err);
});


// Va servir les routes dédiées aux utilisateurs
app.use("/api/users", userRoutes);
// Va servir les routes dédiées aux messages
app.use("/api/messages", messageRoutes);
// Va servir les routes dédiées aux commentaires
app.use("/api/comments", commentRoutes);
// Va servir les routes dédiées aux utilisateurs
app.use("/api/auth", authRoutes);




module.exports = app

