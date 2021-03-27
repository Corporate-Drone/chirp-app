const express = require('express');
const router = express.Router({ mergeParams: true }); //access route params
const passport = require('passport');
const HttpError = require('../models/http-error');
// const { validationResult } = require('express-validator')
const User = require('../models/user');
const singleControllers = require('../controllers/single-controllers');

router.post('/status/:id', singleControllers.getSingleChirp);

module.exports = router;