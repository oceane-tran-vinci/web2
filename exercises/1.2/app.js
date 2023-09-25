var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var filmsRouter = require('./routes/films');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// add middleware => !!! ce middleware doit être avant le traitement de nos routes (voir les 2 derniers routes en fin) !!!
/*
Exercice 1.2 : middleware s'exécutant sur toutes les routes
Consigne : Veuillez créer un middleware qui permet d'enregistrer et 
d'afficher dans la console des statistiques sur les requêtes faites à votre API.
=> "middleware s'exécutant sur toutes les routes" dc faire dans l'app.js et pas dans une seule routes car veut tout
*/

// Création d'un objet vide pour stocker les statistiques de comptage des requêtes
const stats = {};

// Middleware pour récupérer des informations sur les requêtes et les compter
app.use((req, res, next) => {
    const currentOperation = `${req.method} ${req.path}`;// Crée une clé unique en combinant la méthode HTTP et le chemin de la requête
    const currentOperationCounter = stats[currentOperation];// Récupère le compteur actuel pour cette clé d'information
    // Si le compteur n'existe pas (undefined), initialise-le à 0
    if (currentOperationCounter === undefined) {
        stats[currentOperation] = 0;
    };
    stats[currentOperation] += 1;// Incrémente le compteur pour cette clé d'information

    // Crée un message de statistiques affichant les compteurs de requêtes pour chaque clé
    const statsMessage = `Request counter : \n${Object.keys(stats)
        .map((operation) => `- ${operation} : ${stats[operation]}`)
        .join('\n')}
            `;
    /*
    1) Object.keys(tableInfo): Cela prend l'objet tableInfo et utilise la méthode Object.keys() pour obtenir un tableau contenant toutes les clés (noms de propriétés) de cet objet. 
    Dans le contexte de votre code, ces clés représentent des informations sur les requêtes, telles que la méthode HTTP et le chemin de la requête.
    2) .map((operation) => - ${operation} : ${tableInfo[operation]}): La méthode mapest utilisée pour itérer sur le tableau de clés obtenu précédemment. 
    Pour chaque clé (qui est représentée ici par la variableoperation), une chaîne de caractères est créée. Cette chaîne est au format - ${operation} : ${tableInfo[operation]}`, 
    où : - ${operation} : C'est la clé elle-même, généralement au format "MÉTHODE_HTTP CHEMIN_DE_REQUÊTE" (par exemple, "GET /users").
    : ${tableInfo[operation]} : Cela ajoute le compteur de requêtes associé à cette clé. La valeur de ce compteur est extraite de l'objet tableInfo en utilisant la clé (tableInfo[operation]).
    */
    console.log(statsMessage);// Affiche le message de statistiques dans la console
    next();// Passe au middleware suivant
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/films', filmsRouter);

module.exports = app;

/*Pourquoi le midlleware de l'exo 1.2 ne peut pas être ajouté en fin de code?

L'ordre dans lequel les middlewares sont définis dans Express est important car ils sont exécutés dans l'ordre où ils sont déclarés pour chaque requête HTTP entrante. 
Cela signifie que le middleware qui est déclaré en premier sera exécuté en premier, puis le suivant, et ainsi de suite.
Dans votre code, vous avez deux middlewares principaux :
    1. Le premier middleware est celui que vous avez créé pour enregistrer et afficher des statistiques sur les requêtes faites à votre API. 
Ce middleware compte le nombre de requêtes pour chaque méthode HTTP et chemin de requête spécifique. 
Il est important que ce middleware soit déclaré avant le middleware `express.static` car vous voulez compter toutes les requêtes, y compris celles pour les fichiers statiques.
    2. Le deuxième middleware est `express.static`, qui est utilisé pour servir des fichiers statiques tels que des fichiers CSS, JavaScript ou des images. 
Il doit être déclaré après le middleware de statistiques car si vous le mettez en premier, il intercepterait toutes les requêtes, y compris celles pour les fichiers statiques, 
et le middleware de statistiques n'aurait pas l'opportunité de compter ces requêtes.
    En résumé, l'ordre dans lequel vous avez déclaré vos middlewares permet de garantir que les statistiques sur les requêtes sont collectées pour toutes les requêtes, 
    y compris celles pour les fichiers statiques, avant de passer à la gestion des routes spécifiques définies avec `indexRouter`, `usersRouter`, et `filmsRouter`.
*/