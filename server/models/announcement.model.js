const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AncmtSchema = Schema({
    event: {
        type: Number,
        ref: 'Event'
    },
    dateTime: {
        type: Date,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    tags: [{
        type: String
    }]
})

module.exports = mongoose.model('Announcement', AncmtSchema)