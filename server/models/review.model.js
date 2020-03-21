const mongoose = require('mongoose')
const Schema = mongoose.Schema
const counter = require('./counter.model')
async function createCounter() {
    try {
        let existingCounter = await counter.findOne({ _id: "review_Counter" })
        if (!existingCounter) {
            let counterDoc = new counter({
                _id: "review_Counter",
                seq: 0
            })
            let saved = await counterDoc.save()
            if (saved) {
                return console.log("Created counter")
            }
            return console.log("Failed to create a counter.")
        } else {
            return;
        }
    } catch (error) {
        console.log(error)
        return;
    }
}
createCounter()

const reviewSchema = Schema({
    _id: Number,
    team_id: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    event_name: {
        type: String,
        enum: ['Skid Pad', 'Acceleration', 'Autocross', 'Endurance'],
    },
    lap_number: {
        type: String
    },
    lap_time: {
        type: String
    },
    driver_initial: {
        type: String
    },
    event_id: {
        type: Number,
        ref: 'Event'
    }
})

reviewSchema.pre('save', async function (next) {
    let doc = this;
    if(doc.isNew){
        try {
            let incCounter = await counter.findOneAndUpdate({ _id: 'review_Counter' }, { $inc: { seq: 1 } }, { new: true });
            if (incCounter) {
                doc._id = incCounter.seq
                return next()
            }
            return next({ "message": "Couldn't Update the counter." })
        } catch (error) {
            next(error)
        }
    }
})

module.exports = mongoose.model('Review',reviewSchema)
