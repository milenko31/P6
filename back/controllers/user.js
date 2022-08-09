const user = require('../models/users');
const bcrypt = require('bcrypt'); //hacher le mdp
const jwt = require('jsonwebtoken'); //token pour verifier l'authenticité des données par exemple pour une connexion dans avec id mdp etc

// Créer un compte utilisateur
exports.signup = (req, res, next) => {
    console.log(req.body)
    bcrypt.hash(req.body.password, 10) //hash l'élément body du mot de passe et saler 10 fois pour la sécurité
        .then(hash => {
            const newUser = new user({
                email: req.body.email,
                password: hash
            })
            newUser.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) //201 creation de données
                .catch(error => res.status(400).json({ error })) //400 erreur serveur peux pas comprendre ou traiter la requete
        }) //erreur côté client (par exemple une requête dont la syntaxe ou le contenu est invalide).
        .catch(error => res.status(500).json({ error }))
};

// Se connecter à un compte utilisateur
exports.login = (req, res, next) => {
    user.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' }) //verifie si l'user est  bien dans la base de donnée
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' })
                    } //le mot de passe est incorrect renvoie une requete 401
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({ userId: user._id },
                            process.env.SECRET, { expiresIn: '24h' }
                        )
                    })
                })
                .catch(error => res.status(500).json({ error }))
        }) //Le code de réponse d'erreur serveur HTTP 500 Internal Server Error 
        //indique que le serveur a rencontré un problème inattendu qui l'empêche de répondre à la requête.
        .catch(error => res.status(500).json({ error }))
};