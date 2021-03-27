const HttpError = require('../models/http-error');
const Chirp = require('../models/chirp');
const { findById } = require('../models/chirp');

const getAllChirps = async (req, res, next) => {
    try {
        const chirps = await Chirp.find({}).populate('author');
        res.send(chirps)
    } catch (error) {
        console.log(error)
    }
}

// const getSingleChirp = async (req, res, next) => {
//     const chirpId = req.body.id;
//     try {
//         const foundChirp = await Chirp.findById(chirpId).populate('author');
//         res.send(foundChirp)
//     } catch (error) {
//         console.log(error)
//     }
// }

const createChirp = async (req, res, next) => {
    try {
        const { text, replies, likes, date, author } = req.body;
        // console.log(req.body);
        const chirp = new Chirp(req.body);
        await chirp.save();
        res.send('saved')
        //get author as well
    } catch (error) {
        console.log(error)
    }
}

const deleteChirp = async (req, res, next) => {
    const chirpId = req.body.id;
    try {
        await Chirp.findByIdAndDelete(chirpId);
        res.send('deleted')
    } catch (error) {

    }
}

exports.getAllChirps = getAllChirps
exports.createChirp = createChirp;
exports.deleteChirp = deleteChirp;