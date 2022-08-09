const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
//dotenv "npm i dotenv" pour creer des variables d'environnment pour ne pas voir mes données sensibles dans mon projet

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const path = require('path');
const helmet = require('helmet');
const Ddos = require('ddos');
//installation de "ddos" eviter les surcharge de requetes
const ddos = new Ddos;

//L'ordre des middlewares est important ! Si nous plaçons multer avant le middleware d'authentification, même les images 
//des requêtes non authentifiées seront enregistrées dans le serveur. Veillez à placer multer après auth !

mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//Un middleware est un bloc de code qui traite les requêtes et réponses de votre application.
//middleware general pour que tout le monde puisse accéder à la requête

app.use(express.json()); //intercepte toutes les requetes avec du .json 
app.use(ddos.express);
//making images' folder static
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(helmet());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth', userRoutes);
app.use('/api', sauceRoutes);
module.exports = app;

//le premier enregistre « Requête reçue ! » dans la console et passe l'exécution ;
//le deuxième ajoute un code d'état 201 à la réponse et passe l'exécution ;
//le troisième envoie la réponse JSON et passe l'exécution ;
//le dernier élément de middleware enregistre « Réponse envoyée avec succès ! » dans la console.