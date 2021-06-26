const express = require('express');
const router = express.Router({ mergeParams: true }); //access route params
const { check } = require('express-validator/check');

const HttpError = require('../models/http-error');
// const { validationResult } = require('express-validator')
const User = require('../models/user');
const singleControllers = require('../controllers/single-controllers');
const auth = require('../middleware/auth');

router.get('/status/:id', singleControllers.getSingleChirp);

router.post('/status/:id/like', singleControllers.likeChirp);

router.post('/status/:id/reply', [
    check('text', 'Chirp needs to be at least 2 characters and less than 140 characters.').isLength({ min: 2, max: 140 })
], singleControllers.replyToChirp);

router.delete('/status/:id/reply', singleControllers.deleteReply);

router.get('/', singleControllers.getUserChirps);

router.post('/', singleControllers.followUser);

router.get('/followers', singleControllers.getConnections);

router.get('/following', singleControllers.getConnections);

router.get('/likes', singleControllers.getLikedChirps);

module.exports = router;