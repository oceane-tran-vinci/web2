var express = require('express');
var router = express.Router();

const LISTEDEFILM = [
    {
        id: 1,
        title: 'The Suicide Squad',
        duration: 132,
        budget: 5,
        link: 'https://www.allocine.fr/film/fichefilm_gen_cfilm=245535.html', 
    },
    {
        id: 2,
        title: 'Barbie',
        duration: 115,
        budget: 10,
        link: 'https://www.allocine.fr/film/fichefilm_gen_cfilm=173087.html', 
    },
    {
        id: 3,
        title: 'Openheimmer',
        duration: 180,
        budget: 15,
        link: 'https://www.allocine.fr/film/fichefilm_gen_cfilm=296168.html', 
    },
];

/*1.5) changer tout les messages d'erreur avec les status code approprié */
/*1.3*/
// Read all the films, filtered by minimum-duration if the query param exists
router.get('/', (req, res, next) => {
    const minimumFilmDuration = req?.query
        ? parseInt(req.query['minimum-duration'])
        : undefined;

    if(typeof minimumFilmDuration !== 'number' || minimumFilmDuration <= 0)
        return res.sendStatus(400); //error code "Bad Request" : pour indiquer au client que la requête contient des paramètres non valides ou n'est pas complète

    if (!minimumFilmDuration) return res.json(LISTEDEFILM);
    
    const filmsReachingMinimumDuration = LISTEDEFILM.filter(
        (film) => film.duration >= minimumFilmDuration
    );

    return res.json(filmsReachingMinimumDuration);
});


//Read a film from its id in the menu
router.get('/:id', (req, res, next) => {
    const indexOfFilmFound = LISTEDEFILM.findIndex((film) => film.id == req.params.id);
    if (indexOfFilmFound < 0) return res.sendStatus(404); // error code "Not Found" : la ressource demandée n'existe pas, bien que l'URL semble valide.
    return res.json(LISTEDEFILM[indexOfFilmFound]);
});

// Create a film
router.post('/', (req, res) => {
    const title = req?.body?.title?.trim()?.length !== 0 ? req.body.title : undefined;
    const duration = typeof req?.body?.duration !== 'number' || req.body.duration < 0 
    ? undefined 
    : req.body.duration;
    const budget = typeof req?.body?.budget !== 'number' || req.body.duration < 0 
    ? undefined 
    : req.body.budget;
    const link = req?.body?.link?.trim()?.length !== 0 ? req.body.link : undefined;
    
    if (!title || !duration || !budget || !link) return res.sendStatus(400); // error code "Bad Request" : pour indiquer au client que la requête contient des paramètres non valides ou n'est pas complète
    
    const lastItemIndex = LISTEDEFILM?.length !== 0 ? LISTEDEFILM.length - 1 : undefined; 
    const lastId = lastItemIndex !== undefined ? LISTEDEFILM[lastItemIndex]?.id : 0;
    const nextId = lastId + 1;
    const newFilm = { id: nextId, title, duration, budget, link };
    
    LISTEDEFILM.push(newFilm); 

    return res.json(newFilm);
});


module.exports = router;