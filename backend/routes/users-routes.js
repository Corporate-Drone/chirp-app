const express = require('express');
const router = express.Router({ mergeParams: true }); //access route params
const passport = require('passport');
const HttpError = require('../models/http-error');
// const { validationResult } = require('express-validator')
const User = require('../models/user');
const usersControllers = require('../controllers/users-controllers');

router.post('/register', usersControllers.register);

// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), usersControllers.login);

router.post(
    '/login',
    function (req, res, next) {
        next()
    },
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
     async (req, res) => {
        // console.log('logged in', req.user);
        //find full user information
         const fullUser = await User.findOne({ username: req.user.username })
        //  console.log(fullUser);
        // const userInfo = {
        //     username: req.user.username
        // };
        res.send(fullUser);
    }
)

router.get('/logout', usersControllers.logout);

module.exports = router;