const HttpError = require('../models/http-error');
const User = require('../models/user');
const Chirp = require('../models/chirp');

const getSingleChirp = async (req, res, next) => {
    console.log('req received!')
    console.log(req.body)
    const chirpId = req.body.id;
    try {
        const foundChirp = await Chirp.findById(chirpId).populate('author');
        console.log(foundChirp);
        res.send(foundChirp)
    } catch (error) {
        console.log(error)
    }
}

exports.getSingleChirp = getSingleChirp;
