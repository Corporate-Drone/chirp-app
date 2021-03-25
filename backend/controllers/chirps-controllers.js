const HttpError = require('../models/http-error');
const Chirp = require('../models/chirp');

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

exports.createChirp = createChirp;