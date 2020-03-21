const mongoose = require('mongoose')
const validate = require('mongoose-validator')
const CONFIG = require('./../../config/keys')
const counter = require('./counter.model')
let Schema = mongoose.Schema;

(async function createCounter() {
    try {
        let existingCounter = await counter.findOne({ _id: "static_schedules_Counter" })
        if (!existingCounter) {
            let counterDoc = new counter({
                _id: "static_schedules_Counter",
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
})()

let StaticScheduleSchema = Schema({
    _id: Number,
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    event: {
        type: Number,
        ref: 'Event'
    },
    business: {
        queue: {
            type: String,
        },
        start_time: {
            type: Date
        },
        end_time: {
            type: Date
        }
    },
    cost: {
        queue: {
            type: String,
        },
        start_time: {
            type: Date
        },
        end_time: {
            type: Date
        }
    },
    design: {
        queue: {
            type: String,
        },
        start_time: {
            type: Date
        },
        end_time: {
            type: Date
        }
    }
})

StaticScheduleSchema.pre('save', async function (next) {
    let doc = this;
    if (doc.isNew) {
        try {
            let incCounter = await counter.findOneAndUpdate({ _id: 'static_schedules_Counter' }, { $inc: { seq: 1 } }, { new: true });
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

module.exports = mongoose.model('StaticSchedule', StaticScheduleSchema)