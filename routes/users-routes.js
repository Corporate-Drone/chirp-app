const express = require('express');
const router = express.Router({ mergeParams: true }); //access route params
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const HttpError = require('../models/http-error');
const auth = require('../middleware/auth');
const idMatch = require('../middleware/id-match');
const { check } = require('express-validator/check');
const User = require('../models/user');
const usersControllers = require('../controllers/users-controllers');

router.post('/register', [
    check('name', 'Name is required').isLength({ min: 2, max: 15 }),
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password',
        'Please cannot be empty.'
    ).not()
        .isEmpty()
], usersControllers.register);

router.post('/setup', usersControllers.setup);

router.delete('/setup', usersControllers.deleteUser);

router.post('/setup/upload', usersControllers.updateImage);

router.delete('/setup/upload', usersControllers.deleteImage);

router.get('/setup', usersControllers.getUser);

router.post('/login', [
    check('username', 'Username is empty.').not()
        .isEmpty(),
    check('password', 'Password is required').not()
    .isEmpty(),
], usersControllers.login);


router.post('/logout', usersControllers.logout);

module.exports = router;