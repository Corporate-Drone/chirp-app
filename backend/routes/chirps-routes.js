const express = require('express');
const router = express.Router({ mergeParams: true }); //access route params

const Chirp = require('../models/chirp');
const chirpsControllers = require('../controllers/chirps-controllers');

router.post('/', chirpsControllers.createChirp);

module.exports = router;