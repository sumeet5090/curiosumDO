const mongoose = require('mongoose')
const Schema = mongoose.Schema
const SchemaTypes = mongoose.SchemaTypes
const counter = require('./counter.model')
async function createCounter() {
  try {
    let existingCounter = await counter.findOne({ _id: "event_Counter" })
    if (!existingCounter) {
      let counterDoc = new counter({
        _id: "event_Counter",
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

const EventSchema = Schema({
  _id: Number,
  name: {
    type: String,
    required: true
  },
  event_short: {
    type: String,
    default: function () {
      let words = (this.name).split(' ')
      let short_name = ''
      words.forEach(word => {
        if (parseInt(word) == word) {
          short_name += word
        } else {
          short_name += word[0]
        }
      })
      return (short_name).toLowerCase()
    }
  },
  forum: {
    name: String,
    posts: [{
      type: SchemaTypes.ObjectId,
      ref: 'Post'
    }],
  },
  cars: [{
    type: Number,
    ref: 'Car'
  }],
  start_date: {
    type: Date,
    default: Date.now
  },
  end_date: {
    type: Date,
    default: Date.now
  },
  venue: {
    type: String
  },
  organizers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  link: {
    type: String
  },
  teams: [{
    type: Schema.Types.ObjectId,
    ref: 'Team'
  }],
  schedules: [{
    type: Number,
    ref: 'Schedule'
  }],
  live_timings: [{
    type: Number,
    ref: 'LiveTiming'
  }],
  tech_updates: [{
    type: Number,
    ref: 'TechUpdate'
  }],
  static_schedule: [{
    type: Number,
    ref: 'StaticSchedule'
  }],
  past: {
    type: Boolean,
    default: false
  },
  show_block: {
    official_website: { type: Boolean, default: true },
    teams: { type: Boolean, default: true },
    live_announcements: { type: Boolean, default: true },
    rules: { type: Boolean, default: true },
    schedule: { type: Boolean, default: false },
    tech_inspection: { type: Boolean, default: false },
    live_timings: { type: Boolean, default: false },
  }
}, { timestamps: true })

EventSchema.pre('save', async function (next) {
  let doc = this;
  if (doc.isNew) {
    try {
      let incCounter = await counter.findOneAndUpdate({ _id: 'event_Counter' }, { $inc: { seq: 1 } }, { new: true });
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

module.exports = mongoose.model('Event', EventSchema)