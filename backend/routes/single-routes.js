const express = require('express');
const router = express.Router({ mergeParams: true }); //access route params
const passport = require('passport');
const HttpError = require('../models/http-error');
// const { validationResult } = require('express-validator')
const User = require('../models/user');
const singleControllers = require('../controllers/single-controllers');

router.get('/status/:id', singleControllers.getSingleChirp);

router.post('/status/:id/like', singleControllers.likeChirp);

router.post('/status/:id/reply', singleControllers.replyToChirp);

router.delete('/status/:id/reply', singleControllers.deleteReply);

router.get('/', singleControllers.getUserChirps);

router.post('/', singleControllers.followUser);

router.get('/followers', singleControllers.getConnections);

router.get('/following', singleControllers.getConnections);

module.exports = router;