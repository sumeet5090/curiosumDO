const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tokenSchema = Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    team_id: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    for: {
        type: String,
        default: 'member',
        enum: ['member', 'alumni']
    }
})

// tokenSchema.pre('save', async function (next) {
//     next()
// })

module.exports = mongoose.model('Token', tokenSchema)