const mongoose = require('mongoose')
const Schema = mongoose.Schema
const SchemaTypes = mongoose.SchemaTypes
const counter = require('../counter.model')

async function createCounter () {
  try {
    let existingCounter = await counter.findOne({ _id: "reply_Counter" })
    if (!existingCounter) {
      let counterDoc = new counter({
        _id: "reply_Counter",
        seq: 1000
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
const replySchema = Schema({
  _id: Number,
  user: {
    type: SchemaTypes.ObjectId,
    ref: 'User'
  },
  text: String,
  date: {
    type: Date,
    default: Date.now
  },
  highlight: {
    type: Boolean,
    default: false
  },
  pinned: {
    type: Boolean,
    default: false
  },
  post: {
    type: SchemaTypes.ObjectId,
    ref: 'Post'
  }
})

replySchema.pre('save', async function (next) {
  let doc = this
  if (doc.isNew) {
    try {
      let incCounter = await counter.findOneAndUpdate({ _id: 'reply_Counter' }, { $inc: { seq: 1 } }, { new: true })
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

module.exports = mongoose.model('Reply', replySchema)