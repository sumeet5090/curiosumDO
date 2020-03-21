const mongoose = require('mongoose')
const Schema = mongoose.Schema
const counter = require('./counter.model')
async function createCounter() {
  try {
    let existingCounter = await counter.findOne({ _id: "past_event_Counter" })
    if (!existingCounter) {
      let counterDoc = new counter({
        _id: "past_event_Counter",
        seq: 0
      })
      let saved = await counterDoc.save()
      if (saved) {
        return console.log("Created counter")
      }
      return console.log("Failed to create a counter.")
    } else {
      return
    }
  } catch (error) {
    console.log(error)
    return
  }
}
createCounter()

const pastEventSchema = Schema({
  _id: Number,
  teams: [{
    type: Schema.Types.ObjectID,
    ref: 'Team'
  }],
  name: {
    type: String,
  },
  short_name: {
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
  website_url: {
    type: String
  },
  start_date: {
    type: Date
  },
  end_date: {
    type: Date
  }
}, { timestamps: true })

pastEventSchema.pre('save', async function (next) {
  let doc = this
  try {
    if (doc.isNew) {
      let incCounter = await counter.findOneAndUpdate({ _id: 'past_event_Counter' }, { $inc: { seq: 1 } }, { new: true })
      if (incCounter) {
        doc._id = incCounter.seq
        return next()
      }
      return next({ "message": "Couldn't update the counter." })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = mongoose.model('PastEvent', pastEventSchema)