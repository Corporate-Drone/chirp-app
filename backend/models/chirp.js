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
            ref: 'Reply'
        }
    ]
}, opts);

module.exports = mongoose.model('Chirp', chirpSchema);

// id: 1, 
// info: 'Clean Fishtank',
// replies: [{ yuri: 'hello' }],
// rechirps: 0,
// rechirpId: 0,
// likes: 0,
// date: '1/1/21'