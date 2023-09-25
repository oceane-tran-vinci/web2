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

// Read all the films, filtered by minimum-duration if the query param exists
router.get('/', (req, res, next) => {
    // Récupère la valeur du paramètre 'minimum-duration' de la requête, s'il existe.
    const minimumFilmDuration = req?.query
        ? parseInt(req.query['minimum-duration'])
        : undefined;

    // Vérifie si 'minimumFilmDuration' n'est pas un nombre valide ou s'il est inférieur ou égal à zéro.
    if(typeof minimumFilmDuration !== 'number' || minimumFilmDuration <= 0)
        return res.json('Wrong minimum duration');// Répond avec un message d'erreur.

    // Si 'minimumFilmDuration' n'est pas défini (c'est-à-dire si le paramètre 'minimum-duration' est absent dans la requête),
    // renvoie la liste complète de films (LISTEDEFILM) en tant que réponse JSON.
    if (!minimumFilmDuration) return res.json(LISTEDEFILM);
    
    // Si 'minimumFilmDuration' est valide, filtre la liste des films pour ne conserver que ceux ayant une durée supérieure ou égale à 'minimumFilmDuration'.
    const filmsReachingMinimumDuration = LISTEDEFILM.filter(
        (film) => film.duration >= minimumFilmDuration
    );

    // Répond avec la liste des films filtrés en tant que réponse JSON.
    return res.json(filmsReachingMinimumDuration);
});


//Read a film from its id in the menu
router.get('/:id', (req, res, next) => {
    // Recherche l'indice du film correspondant à l'ID fourni dans la requête.
    const indexOfFilmFound = LISTEDEFILM.findIndex((film) => film.id == req.params.id);
    // Si aucun film correspondant n'est trouvé, renvoie un message d'erreur.
    if (indexOfFilmFound < 0) return res.json('Resource not found'); 
    // Si un film correspondant est trouvé, renvoie ce film en tant que réponse JSON.
    return res.json(LISTEDEFILM[indexOfFilmFound]);
});

// Create a film
router.post('/', (req, res) => {
    //(La fonction trim est utilisée pour supprimer les espaces en début et en fin de chaîne. (use for words))
    // Récupère et valide les données du corps de la requête pour le titre, la durée, le budget et le lien du film.
    const title = req?.body?.title?.trim()?.length !== 0 ? req.body.title : undefined;
    const duration = typeof req?.body?.duration !== 'number' || req.body.duration < 0 
    ? undefined 
    : req.body.duration;
    const budget = typeof req?.body?.budget !== 'number' || req.body.duration < 0 
    ? undefined 
    : req.body.budget;
    const link = req?.body?.link?.trim()?.length !== 0 ? req.body.link : undefined;
    
    // Vérifie si l'un des champs requis (titre, durée, budget, lien) est manquant ou vide, et renvoie un message 'Requête incorrecte' en cas de manquement.
    if (!title || !duration || !budget || !link) return res.json('Bad request');
    
    const lastItemIndex = LISTEDEFILM?.length !== 0 ? LISTEDEFILM.length - 1 : undefined; // Trouve l'indice du dernier élément dans la liste des films, si la liste n'est pas vide.   
    const lastId = lastItemIndex !== undefined ? LISTEDEFILM[lastItemIndex]?.id : 0;// Obtient l'ID du dernier film dans la liste, ou le définit à 0 si la liste est vide.
    const nextId = lastId + 1;// Calcule l'ID du nouveau film comme le numéro séquentiel suivant.
    
    const newFilm = { id: nextId, title, duration, budget, link };// Crée un nouvel objet film avec les données fournies et l'ID calculé.
    
    LISTEDEFILM.push(newFilm); // Ajoute le nouveau film à la liste des films.

    return res.json(newFilm);// Répond avec un objet JSON vide pour indiquer le succès.
});




module.exports = router;