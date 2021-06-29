const { validationResult } = require('express-validator/check');

const HttpError = require('../models/http-error');
const Chirp = require('../models/chirp');
const User = require('../models/user');
const Reply = require('../models/reply');
const { findById } = require('../models/chirp');
const chirp = require('../models/chirp');

const getAllChirps = async (req, res, next) => {
    const { userId } = req.query;
    try {
        const chirps = await Chirp.find({}).populate('author');
        const replies = await Reply.find({}).populate('author');
        const allChirps = [...chirps, ...replies]
        //get chirps from user following
        const user = await User.findById(userId)

        let followedChirps = [];
        for (let chirp of chirps) {
            //get user's own chirps & chirps based on users followed 
            if (user.following.includes(chirp.author._id) || userId == chirp.author._id) {
                followedChirps.push(chirp)
            }
        }
        res.send(followedChirps)
    } catch (error) {
        console.log(error)
    }
}

const createChirp = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const { text, replies, likes, date, author } = req.body;
        const chirp = new Chirp(req.body);
        await chirp.save();
        res.send('saved')
    } catch (error) {
        console.log(error)
    }
}

const deleteChirp = async (req, res) => {
    const chirpId = req.body.id;
    const parentId = req.body.chirpId;
    const isReply = req.body.isReply;
    try {
        //remove from thread if Chirp is a reply
        if (isReply) {
            await Chirp.findByIdAndUpdate(parentId, { $pull: { replies: chirpId } })
        }

        //delete the chirp
        await Chirp.findByIdAndDelete(chirpId);
        res.send('deleted')
    } catch (error) {
        console.log(error)
    }
}

exports.getAllChirps = getAllChirps
exports.createChirp = createChirp;
exports.deleteChirp = deleteChirp;