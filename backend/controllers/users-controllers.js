const HttpError = require('../models/http-error');
const User = require('../models/user');
const { cloudinary } = require('../cloudinary');


const register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        const fullUser = await User.findOne({ username: req.body.username })
        // const newUser = (req.body.username)
        res.send(fullUser);

    } catch (error) {
        return next(
            new HttpError('Registration failed, please try again.', 500)
        );
        console.log(error)
    }

}

const getUser = async (req, res, next) => {
    const { id } = req.query
    try {
        const foundUser = await User.findById(id)
        console.log(foundUser)
        res.send(foundUser);
    } catch (error) {

    }
}

const setup = async (req, res, next) => {
    try {
        const { userId, about } = req.body;
        // update about me text
        const updatedUser = await User.findByIdAndUpdate(userId, { about },{new: true});
        res.send(updatedUser)
    } catch (error) {
        console.log(error)
    }
}

const deleteImage = async (req, res, next) => {
    try {
        console.log('***DELETE REQUEST RECEIVED***')
        console.log(req.body)
        const { userId, url, filename } = req.body;
        await cloudinary.uploader.destroy(filename);
        const updatedUser = await User.findByIdAndUpdate(userId, {
            image: {
                url: undefined,
                filename: undefined
            }
        }, { new: true });
        res.send(updatedUser);
    } catch (error) {
        console.log(error)
    }
}

const updateImage = async (req, res, next) => {
    try {
        const { userId, url, filename } = req.body;
        const foundUser = await User.findById(userId)
        if (foundUser.image.filename) { //delete previous profile picture
            await cloudinary.uploader.destroy(foundUser.image.filename);
        }
        const updatedUser = await User.findByIdAndUpdate(userId, {
            image: {
                url: url,
                filename: filename
            }
        }, { new: true });
        res.send(updatedUser)
    } catch (error) {
        console.log(error)
    }
}


const logout = (req, res, next) => {
    // if (req.user) {
    //     req.logout();
    //     console.log('user logged out!')
    // }
    req.logout()
    res.send({ message: 'Logged out!' })

}

exports.register = register;
exports.getUser = getUser;
exports.setup = setup;
exports.deleteImage = deleteImage;
exports.updateImage = updateImage;
exports.logout = logout;