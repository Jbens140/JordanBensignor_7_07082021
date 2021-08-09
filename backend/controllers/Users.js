
const db = require("../models")
const User = db.users
const Message = db.messages
const Comment = db.comments

// Trouver un utilisateur
exports.findOneUser = (req, res, next) => {
    const userInfo = {}
    User.findOne({ where: { id: req.params.id }})
    .then(user => {
        userInfo.userName = user.userName
        userInfo.email = user.email
        if (user.isAdmin == false) {
          userInfo.role = "Utilisateur"
        } else {
          userInfo.role = "Administrateur"
        }
        userInfo.createdAt = user.createdAt
        userInfo.avatar = user.avatar
    })
    .then(() => {
        Comment.count({ where: { userId: req.params.id }})
        .then(cmtcount => { userInfo.commentsCount = cmtcount })
    })
    .then(() => {
        Message.count({ where: { userId: req.params.id }})
        .then(msgcount => { 
            userInfo.messagesCount = msgcount 
            res.status(200).json(userInfo)
        })
    })  
    .catch(error => res.status(404).json({ error }))
}

// Modifier un utilisateur
exports.modifyUser = (req, res, next) => {
    const userObject = req.file ?
        {
            ...req.body.userId,
            avatar: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        } : { ... req.body}
    User.update({ ...userObject, id:  req.params.id}, { where: { id: req.params.id }})
      .then(() => res.status(200).json({ ...userObject }))
      .catch(error => res.status(400).json({ error }))
}









// const bcrypt =  require('bcrypt');   // pour crypter le mot de passe                                                 
// const jwt =     require('jsonwebtoken'); // attribution d'un token lors de la connexion de l'utilisateur                                            
// const User =    require('../models/User');
// const maskemail = require('maskemail') // permet crypter les emails 

// exports.signup = (req, res, next) => {
//     // On appelle la méthode hash de bcrypt et on lui passe le mdp de l'utilisateur, le salte (10) ce sera le nombre de tours qu'on fait faire à l'algorithme
//     bcrypt.hash(req.body.password, 10)
//       // On récupère le hash de mdp qu'on va enregister en tant que nouvel utilisateur dans la BBD mongoDB
//       .then(hash => {
//         // Création du nouvel utilisateur avec le model mongoose
//         const user = new User({
//           // On passe l'email qu'on trouve dans le corps de la requête
//           email: maskemail(req.body.email),
//           // On récupère le mdp hashé de bcrypt
//           password: hash
//         });
//         // On enregistre l'utilisateur dans la base de données
//         user.save()
//           .then(() => res.status(201).json({
//             message: 'Utilisateur créé !'
//           }))
//           .catch(error => res.status(400).json({
//             error
//           })); // Si il existe déjà un utilisateur avec cette adresse email
//       })
//       .catch(error => res.status(500).json({
//         error
//       }));
  
//   };

//   exports.login = (req, res, next) => {
//     // On doit trouver l'utilisateur dans la BDD qui correspond à l'adresse entrée par l'utilisateur
//     console.log(req.body.email)
//     User.findOne({
//         email: maskemail(req.body.email)
//       })
//       .then(user => {
//        console.log(user)
//         // Si on trouve pas l'utilisateur on va renvoyer un code 401 "non autorisé"
//         if (!user) {
//           return res.status(401).json({
//             error: 'Utilisateur non trouvé !'
//           });
//         }
//         // On utilise bcrypt pour comparer les hashs et savoir si ils ont la même string d'origine
//         bcrypt.compare(req.body.password, user.password)
//           .then(valid => {
//             // Si false, c'est que ce n'est pas le bon utilisateur, ou le mot de passe est incorrect
//             if (!valid) {
//               return res.status(401).json({
//                 error: 'Mot de passe incorrect !'
//               });
//             }
//             // Si true, on renvoie un statut 200 et un objet JSON avec un userID + un token
//             res.status(200).json({ // Le serveur backend renvoie un token au frontend
//               userId: user._id,
//               // Permet de vérifier si la requête est authentifiée
//               // on va pouvoir obtenir un token encodé pour cette authentification grâce à jsonwebtoken, on va créer des tokens et les vérifier
//               token: jwt.sign( // Encode un nouveau token avec une chaine de développement temporaire
//                 {
//                   userId: user._id
//                 }, // Encodage de l'userdID nécéssaire dans le cas où une requête transmettrait un userId (ex: modification d'une sauce)
//                 'RANDOM_TOKEN_SECRET', // Clé d'encodage du token qui peut être rendue plus complexe en production
//                 // Argument de configuration avec une expiration au bout de 24h
//                 {
//                   expiresIn: '24h'
//                 }
//               )
//             });
//           })
//           .catch(error => res.status(500).json({
//             error
//           }));
//       })
//       .catch(error => res.status(500).json({
//         error
//       }));
//   };