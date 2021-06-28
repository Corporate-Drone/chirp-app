const express = require('express');
const router = express.Router({ mergeParams: true }); //access route params
const { check } = require('express-validator/check');
const Chirp = require('../models/chirp');
const chirpsControllers = require('../controllers/chirps-controllers');
const auth = require('../middleware/auth');
const idMatch = require('../middleware/id-match');

router.get('/', chirpsControllers.getAllChirps);

router.post('/', [
    check('text', 'Chirp needs to be at least 2 characters and less than 140 characters.').isLength({ min: 2, max: 140 })
], auth, idMatch, chirpsControllers.createChirp);

router.delete('/', auth, idMatch, chirpsControllers.deleteChirp);



module.exports = router;