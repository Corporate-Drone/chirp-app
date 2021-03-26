const HttpError = require('../models/http-error');
const Chirp = require('../models/chirp');

const getAllChirps = async (req, res, next) => {
    try {
        const chirps = await Chirp.find({}).populate('author');
        res.send(chirps)
    } catch (error) {
        console.log(error)
    }

}

const createChirp = async (req, res, next) => {
    try {
        const { text, replies, likes, date, author } = req.body;
        // console.log(req.body);
        const chirp = new Chirp(req.body);
        await chirp.save();
        console.log(chirp);
        //get author as well
    } catch (error) {
        console.log(error)
    }


}

exports.getAllChirps = getAllChirps
exports.createChirp = createChirp;