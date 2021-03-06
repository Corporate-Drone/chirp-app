const { validationResult } = require('express-validator/check');

const User = require('../models/user');
const Chirp = require('../models/chirp');
const Reply = require('../models/reply');

const getSingleChirp = async (req, res) => {
    const chirpId = req.query.id;
    try {
        //find Chirp, else find reply
        const foundChirp = await (await Chirp.findById(chirpId).populate({
            path: 'replies',
            populate: {
                path: 'author'
            }
        }).populate('author'));

        //If a chirp isn't found, find & send back a Reply
        if (foundChirp) {
            res.send(foundChirp)
        } else {
            const foundReply = await (await Reply.findById(chirpId).populate({
                path: 'replies',
                populate: {
                    path: 'author'
                }
            }).populate('author'));
            res.send(foundReply);
        }

        // res.send(foundChirp)
    } catch (error) {
        console.log(error)
    }
}

const getUserChirps = async (req, res) => {
    const username = req.query.id
    const type = req.query.type

    try {
        const chirps = await Chirp.find({}).populate('author');

        let userChirps = [];

        if (type === 'chirps') {
            for (chirp of chirps) {
                if (username === chirp.author.username) {
                    userChirps.push(chirp)
                }
            }
            res.send(userChirps)
        } else {
            const user = await User.findOne({ username: username })
            if (!user) {
                res.status(401).send({ msg: 'User such user exists.' });
            }
            res.send(user)
        }

    } catch (error) {
        console.log(error)
    }
}

const getLikedChirps = async (req, res) => {
    const username = req.query.id
    const user = await User.findOne({ username: username })

    try {
        const chirps = await Chirp.find({}).populate('author');

        let likedChirps = [];

        for (chirp of chirps) {
            for (liked of chirp.likes) {
                if (chirp.likes.includes(user.id)) {
                    likedChirps.push(chirp)
                }
            }

        }
        res.send(likedChirps)

    } catch (error) {
        console.log(error)
    }
}

const likeChirp = async (req, res) => {
    const chirp = await Chirp.findById(req.body.id).populate('author');
    const username = req.body.username

    const user = await User.findOne({ username: username })
    try {
        //add or remove like from Chirp
        if (chirp.likes.includes(user._id)) {
            chirp.likes.pull(user._id);
        } else {
            chirp.likes.push(user);
        }

        await chirp.save();
        console.log(user)
        res.send(chirp)
    } catch (error) {
        console.log(error)
    }
}

const replyToChirp = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const { id, text, username, date } = req.body;
        const chirp = await Chirp.findById(id);
        const parentChirpUser = await User.findOne({ _id: chirp.author })
        const user = await User.findOne({ username: username })

        const reply = new Chirp()
        reply.author = user;
        reply.text = text;
        reply.date = date;
        reply.likes = [];
        reply.isReply = true;
        reply.parentChirpId = id;
        reply.parentUsername = parentChirpUser.username

        chirp.replies.push(reply);
        await chirp.save();
        await reply.save();
        res.send('comment added!')
    } catch (error) {
        console.log(error)
    }
}

const deleteReply = async (req, res) => {
    const replyId = req.body.id;
    const chirpId = req.body.chirpId
    try {
        console.log('***DELETE REQUEST RECEIVED***')
        await Chirp.findByIdAndUpdate(chirpId, { $pull: { replies: replyId } })

        await Chirp.findByIdAndDelete(replyId)
        res.send('Reply deleted!')
    } catch (error) {
        console.log(error)
    }
}

const followUser = async (req, res) => {
    const { actionUsername, reqUserId } = req.body;
    const userToFollow = await User.findOne({ username: actionUsername })
    const requestingUser = await User.findById(reqUserId)
    try {
        if (userToFollow.username !== requestingUser.username) {
            //add or remove user from followers
            if (userToFollow.followers.includes(requestingUser._id)) {
                userToFollow.followers.pull(requestingUser._id);
                requestingUser.following.pull(userToFollow._id);
                console.log('pull')
            } else {
                userToFollow.followers.push(requestingUser._id);
                requestingUser.following.push(userToFollow._id);
                console.log('push')
            }
        }

    } catch (error) {
        console.log(error)
    }
    await userToFollow.save();
    await requestingUser.save();
    res.send('Saved')
}

const getConnections = async (req, res) => {
    //type = 'followers' or 'following'
    const { id, type } = req.query
    const user = await User.findOne({ username: id }).populate({
        path: `${type}`,
        populate: {
            path: `${type}`
        }
    })
    if (type === 'following') {
        res.send(user.following)
    } else {
        res.send(user.followers)
    }
}

exports.getSingleChirp = getSingleChirp;
exports.getUserChirps = getUserChirps;
exports.getLikedChirps = getLikedChirps
exports.likeChirp = likeChirp;
exports.replyToChirp = replyToChirp;
exports.deleteReply = deleteReply;
exports.followUser = followUser;
exports.getConnections = getConnections;
