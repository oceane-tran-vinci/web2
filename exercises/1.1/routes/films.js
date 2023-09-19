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
    }
]

// READ all the movies from the listeDeMenu
router.get('/', function(req, res, next){
    console.log('GET /films');
    res.json(LISTEDEFILM);
});

module.exports = router;