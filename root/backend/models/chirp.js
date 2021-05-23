const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };

const chirpSchema = new Schema({
    date: String,
    text: String,
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    author: {
        //acquire author ID & populate using User model
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    replies: [
        {
            //acquire comment ID & populate using Comment model
            type: Schema.Types.ObjectId,
            ref: 'Chirp'
        }
    ],
    isReply: Boolean,
    anchorChirpId: String,
    anchorUsername: String,
    parentChirpId: String,
    parentUsername: String
}, opts);

module.exports = mongoose.model('Chirp', chirpSchema);
