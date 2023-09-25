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

/*1.3*/

// Read all the films, filtered by minimum-duration if the query param exists
router.get('/', (req, res, next) => {
    const minimumFilmDuration = req?.query
        ? parseInt(req.query['minimum-duration'])
        : undefined;

    if(typeof minimumFilmDuration !== 'number' || minimumFilmDuration <= 0)
        return res.sendStatus(400); //error code "Bad Request"

    if (!minimumFilmDuration) return res.json(LISTEDEFILM);
    
    const filmsReachingMinimumDuration = LISTEDEFILM.filter(
        (film) => film.duration >= minimumFilmDuration
    );

    return res.json(filmsReachingMinimumDuration);
});


//Read a film from its id in the menu
router.get('/:id', (req, res, next) => {
    const indexOfFilmFound = LISTEDEFILM.findIndex((film) => film.id == req.params.id);
    if (indexOfFilmFound < 0) return res.sendStatus(404); // error code "Not Found"
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
    
    if (!title || !duration || !budget || !link) return res.sendStatus(400); // error code "Bad Request"
    
    const lastItemIndex = LISTEDEFILM?.length !== 0 ? LISTEDEFILM.length - 1 : undefined; 
    const lastId = lastItemIndex !== undefined ? LISTEDEFILM[lastItemIndex]?.id : 0;
    const nextId = lastId + 1;
    const newFilm = { id: nextId, title, duration, budget, link };
    
    LISTEDEFILM.push(newFilm); 

    return res.json(newFilm);
});

/* 1.6 */
// 1.6.1 Delete a film
router.delete('/:id', (req, res, next) => {
    // Recherche l'indice du film correspondant à l'ID fourni dans les paramètres de la requête.
    const foundIndexOfFilm = LISTEDEFILM.findIndex((film) => film.id == req.params.id);

    // Si aucun film correspondant n'est trouvé, renvoie une réponse HTTP 404 (Not Found).
    if (foundIndexOfFilm < 0) return res.sendStatus(404);

    // Utilise la méthode 'splice' pour supprimer un élément à partir de l'indice trouvé.
    // Dans ce cas, nous supprimons 1 élément, et la méthode renvoie un tableau des éléments supprimés.
    const itemsRemovedFromLISTEDEFILM = LISTEDEFILM.splice(foundIndexOfFilm, 1);

    // Récupère le film supprimé du tableau des éléments supprimés.
    const itemsRemoved = itemsRemovedFromLISTEDEFILM[0];

    // Répond avec le film supprimé en tant que réponse JSON.
    res.json(itemsRemoved);
});

//1.6.2 Update one or more properties of a film identified by its id
router.patch('/:id', function (req, res) {
    // Récupère les valeurs potentiellement mises à jour pour le titre, le lien, la durée et le budget du film à partir du corps de la requête.
    const title = req?.body?.title;
    const link = req?.body?.link;
    const duration = req?.body?.duration;
    const budget = req?.body?.budget;
  
    // Vérifie si le corps de la requête est vide ou si certaines données mises à jour sont invalides.
    if (!req.body ||
      (title !== undefined && !title.trim()) ||
      (link !== undefined && !link.trim()) ||
      (duration !== undefined && (typeof req?.body?.duration !== 'number' || duration < 0)) ||
      (budget !== undefined && (typeof req?.body?.budget !== 'number' || budget < 0))
    )
      return res.sendStatus(400); // Répond avec une réponse HTTP 400 (Bad Request) en cas d'erreur de validation.
  
    // Recherche l'indice du film correspondant à l'ID fourni dans les paramètres de la requête.
    const indexOfFilmFound = LISTEDEFILM.findIndex((film) => film.id == req.params.id);
  
    // Si aucun film correspondant n'est trouvé, renvoie une réponse HTTP 404 (Not Found).
    if (indexOfFilmFound < 0) return res.sendStatus(404);
  
    // Récupère le film existant avant la mise à jour.
    const filmPriorToChange = LISTEDEFILM[indexOfFilmFound];
  
    // Crée un objet contenant les propriétés à mettre à jour en fusionnant les données existantes avec les données de la requête.
    const objectContainingPropertiesToBeUpdated = req.body;
  
    // Crée un nouveau film mis à jour en fusionnant les données du film existant avec les données à mettre à jour.
    const updatedFilm = {
      ...filmPriorToChange,
      ...objectContainingPropertiesToBeUpdated,
    };
  
    // Remplace l'ancien film par le film mis à jour dans la liste des films.
    LISTEDEFILM[indexOfFilmFound] = updatedFilm;
  
    // Répond avec le film mis à jour en tant que réponse JSON.
    return res.json(updatedFilm);
  });
  

// 1.6.3 Met à jour un film uniquement si toutes les propriétés sont fournies, ou le crée s'il n'existe pas et que l'ID n'existe pas non plus.
router.put('/:id', function (req, res) {
    // Récupère les valeurs pour le titre, le lien, la durée et le budget du film à partir du corps de la requête.
    const title = req?.body?.title;
    const link = req?.body?.link;
    const duration = req?.body?.duration;
    const budget = req?.body?.budget;
  
    // Vérifie si le corps de la requête est vide ou si certaines données sont manquantes ou invalides.
    if (!req.body ||
      !title ||
      !title.trim() ||
      !link ||
      !link.trim() ||
      duration === undefined ||
      typeof req?.body?.duration !== 'number' ||
      duration < 0 ||
      budget === undefined ||
      typeof req?.body?.budget !== 'number' ||
      budget < 0
    )
      return res.sendStatus(400); // Répond avec une réponse HTTP 400 (Bad Request) en cas d'erreur de validation.
  
    const id = req.params.id;
    const indexOfFilmFound = LISTEDEFILM.findIndex((film) => film.id == id);
  
    // Si aucun film correspondant n'est trouvé, crée un nouveau film avec les données fournies et l'ID fourni.
    if (indexOfFilmFound < 0) {
      const newFilm = { id, title, link, duration, budget };
      LISTEDEFILM.push(newFilm);
      return res.json(newFilm);
    }
  
    const filmPriorToChange = LISTEDEFILM[indexOfFilmFound];// Si un film correspondant est trouvé, récupère le film existant.
    const objectContainingPropertiesToBeUpdated = req.body;// Crée un objet contenant les propriétés à mettre à jour en fusionnant les données existantes avec les données de la requête.

    // Crée un nouveau film mis à jour en fusionnant les données du film existant avec les données à mettre à jour.
    const updatedFilm = {
      ...filmPriorToChange,
      ...objectContainingPropertiesToBeUpdated,
    };
    
    LISTEDEFILM[indexOfFilmFound] = updatedFilm;// Remplace l'ancien film par le film mis à jour dans la liste des films.
  
    return res.json(updatedFilm);// Répond avec le film mis à jour en tant que réponse JSON.
  });
  

module.exports = router;