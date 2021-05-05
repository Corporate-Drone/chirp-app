const HttpError = require('../models/http-error');
const User = require('../models/user');
const Chirp = require('../models/chirp');
const Reply = require('../models/reply');
const { cloudinary } = require('../cloudinary');


const register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        const fullUser = await User.findOne({ username: req.body.username })

        //add image object to new user
        const updatedUser = await User.findByIdAndUpdate(fullUser._id, {
            image: {
                url: undefined,
                filename: undefined
            }
        }, { new: true });
        // const newUser = (req.body.username)
        res.send(updatedUser);

    } catch (error) {
        console.log(error.message)
        return next(
            new HttpError('Registration failed, please try again.', 500)
        );
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
        const updatedUser = await User.findByIdAndUpdate(userId, { about }, { new: true });
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

const deleteUser = async (req, res, next) => {
    try {
        console.log('***DELETE REQUEST RECEIVED***')
        const { userId, url, filename, username } = req.body;
        const user = await User.findById(userId);
        const users = await User.find({});

        const chirps = await (await Chirp.find({}).populate({
            path: 'replies',
            populate: {
                path: 'author'
            }
        }).populate('author likes'))

        for (let chirp of chirps) {
            if (chirp.author.username === username) {
                //find and delete chirp
                await Chirp.findByIdAndDelete(chirp._id);
            }
            //delete all replies made by user
            for (let replies of chirp.replies) {
                if (replies.author.username === username) {
                    await Chirp.findByIdAndUpdate(chirp._id, { $pull: { replies: replies._id } })
                    await Chirp.findByIdAndDelete(replies._id);
                }
            }
            //remove all likes made by user
            for (let likes of chirp.likes) {
                if (likes.username === username) {
                    await Chirp.findByIdAndUpdate(chirp._id, { $pull: { likes: likes._id } })
                }
            }
        }
        
        for (let user of users) {
            //remove user from followers
            for (let follower of user.followers) {
                if (follower == userId) {
                    await User.findByIdAndUpdate(user._id, { $pull: { followers: follower } })
                }
            }
        }

        //delete profile picture in cloudinary
        if (user.image && user.image.filename && user.image.filename !== null) {
            await cloudinary.uploader.destroy(user.image.filename);
        }

        //Finally delete user
        await User.findByIdAndDelete(user._id);

        res.send('deleted!')
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
exports.deleteUser = deleteUser;
exports.logout = logout;