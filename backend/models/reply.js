const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };

const replySchema = new Schema({
    text: String,
    date: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    replies: [
        {
            //acquire comment ID & populate using Comment model
            type: Schema.Types.ObjectId,
            ref: 'Reply'
        }
    ],
    isReply: Boolean,
    anchorChirpId: String,
    anchorUsername: String,
    parentChirpId: String,
    parentUsername: String
}, opts);

module.exports = mongoose.model("Reply", replySchema);