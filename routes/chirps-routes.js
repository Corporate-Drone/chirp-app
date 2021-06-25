const express = require('express');
const router = express.Router({ mergeParams: true }); //access route params

const Chirp = require('../models/chirp');
const chirpsControllers = require('../controllers/chirps-controllers');
const auth = require('../middleware/auth');

router.get('/', chirpsControllers.getAllChirps);

router.post('/', chirpsControllers.createChirp);

router.delete('/', chirpsControllers.deleteChirp);



module.exports = router;