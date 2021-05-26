const express = require('express');
const router = express.Router({ mergeParams: true }); //access route params
const allUsersControllers = require('../controllers/allUsers-controllers');

router.get('/', allUsersControllers.getAllUsers);

module.exports = router;