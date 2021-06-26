const express = require('express');
const router = express.Router({ mergeParams: true }); //access route params
const { check } = require('express-validator/check');
const Chirp = require('../models/chirp');
const chirpsControllers = require('../controllers/chirps-controllers');
const auth = require('../middleware/auth');

router.get('/', chirpsControllers.getAllChirps);

router.post('/', [
    check('text', 'Chirp needs to be at least 2 characters and less than 140 characters.').isLength({ min: 2, max: 140 })
], chirpsControllers.createChirp);

router.delete('/', chirpsControllers.deleteChirp);



module.exports = router;