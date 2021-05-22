const express = require('express');
const router = express.Router({ mergeParams: true }); //access route params
const passport = require('passport');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const HttpError = require('../models/http-error');
// const { validationResult } = require('express-validator')
const User = require('../models/user');
const usersControllers = require('../controllers/users-controllers');

router.post('/register', usersControllers.register);

router.post('/setup', usersControllers.setup);

router.delete('/setup', usersControllers.deleteUser);

router.post('/setup/upload', usersControllers.updateImage);

router.delete('/setup/upload', usersControllers.deleteImage);

router.get('/setup', usersControllers.getUser);

router.post(
    '/login',
    passport.authenticate('local'),
    async (req, res) => {
        try {
             
         const fullUser = await User.findOne({ username: req.user.username })
          res.send(fullUser);
        } catch (error) {
            console.log(error)
                        return next(
                new HttpError('Login failed, please try again.', 500)
            );
         }

    }
)


router.post('/logout', usersControllers.logout);

module.exports = router;