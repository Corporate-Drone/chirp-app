const HttpError = require('../models/http-error');
const User = require('../models/user');
const Chirp = require('../models/chirp');
const Reply = require('../models/reply');

const getSingleChirp = async (req, res, next) => {
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

const getUserChirps = async (req, res, next) => {
    const username = req.query.id

    try {
        const chirps = await Chirp.find({}).populate('author');

        let userChirps = [];

        for (chirp of chirps) {
            if (username === chirp.author.username) {
                userChirps.push(chirp)
            }
        }
        res.send(userChirps)

    } catch (error) {
        console.log(error)
    }
}

const likeChirp = async (req, res, next) => {
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
        res.send(user)
    } catch (error) {

    }
}

const replyToChirp = async (req, res, next) => {
    try {
        const { id, text, username, date } = req.body;
        const chirp = await Chirp.findById(id);
        const user = await User.findOne({ username: username })

        const reply = new Reply()
        reply.author = user;
        reply.text = text;
        reply.date = date;
        reply.likes = [];
        reply.isReply = true;

        chirp.replies.push(reply);
        await chirp.save();
        await reply.save();
        res.send('comment added!')

    } catch (error) {

    }
}

const deleteReply = async (req, res, next) => {
    const replyId = req.body.id;
    const chirpId = req.body.chirpId
    try {
        console.log('***DELETE REQUEST RECEIVED***')
        //remove reply from Chirp
        await Chirp.findByIdAndUpdate(chirpId, { $pull: { replies: replyId } })
        await Reply.findByIdAndDelete(replyId)
        res.send('Reply deleted!')
    } catch (error) {

    }
}

exports.getSingleChirp = getSingleChirp;
exports.getUserChirps = getUserChirps;
exports.likeChirp = likeChirp;
exports.replyToChirp = replyToChirp;
exports.deleteReply = deleteReply;
