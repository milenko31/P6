const express = require('express');
const app = express();
const mongoose = require('mongoose');
const thingUsers = require('./models/users');
mongoose.connect("mongodb+srv://cluster0.1fvdfto.mongodb.net/myFirstDatabase", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
//Un middleware est un bloc de code qui traite les requêtes et réponses de votre application.
//middleware general pour que tout le monde puisse accéder à la requête

app.use(express.json()); //intercepte toutes les requetes avec du .json 

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use((req, res, next) => {
    console.log('Requête reçue !');
    next();
});

app.use((req, res, next) => {
    res.status(201);
    next();
});

app.use((req, res, next) => {
    res.json({ message: 'Votre requête a bien été reçue !' });
    next();
});

app.use((req, res) => {
    console.log('Réponse envoyée avec succès !');
});

module.exports = app;


//le premier enregistre « Requête reçue ! » dans la console et passe l'exécution ;
//le deuxième ajoute un code d'état 201 à la réponse et passe l'exécution ;
//le troisième envoie la réponse JSON et passe l'exécution ;
//le dernier élément de middleware enregistre « Réponse envoyée avec succès ! » dans la console.