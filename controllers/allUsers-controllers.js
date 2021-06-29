const User = require('../models/user');

const getAllUsers = async (req,res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        console.log(error)
    }

}

exports.getAllUsers = getAllUsers;