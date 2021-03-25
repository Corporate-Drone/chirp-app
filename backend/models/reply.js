const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const replySchema = new Schema({
    body: String,
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
    ]
});

module.exports = mongoose.model("Reply", replySchema);