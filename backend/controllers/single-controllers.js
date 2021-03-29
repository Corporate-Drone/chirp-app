const HttpError = require('../models/http-error');
const User = require('../models/user');
const Chirp = require('../models/chirp');
const Reply = require('../models/reply');

const getSingleChirp = async (req, res, next) => {
    const chirpId = req.body.id;
    try {
        const foundChirp = await (await Chirp.findById(chirpId).populate({
            path: 'replies',
            populate: {
                path: 'author'
            }
        }).populate('author'));

        res.send(foundChirp)
    } catch (error) {
        console.log(error)
    }
}

const likeChirp = async (req, res, next) => {
    const chirp = await Chirp.findById(req.body.id);
    console.log(req.user)
    // const user = await User.findOne({ username: username })
    try {
        //add or remove like from Chirp
        if (chirp.likes.includes(req.user._id)) {
            chirp.likes.pull(req.user._id);
        } else {
            chirp.likes.push(req.user);
        }

        await chirp.save();
        res.send('Chirp like handled!')
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
exports.likeChirp = likeChirp;
exports.replyToChirp = replyToChirp;
exports.deleteReply = deleteReply;
