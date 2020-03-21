const mongoose = require('mongoose')
const cheerio = require('cheerio')
const marked = require('marked')
const Schema = mongoose.Schema
const counter = require('../counter.model')
async function createCounter() {
  try {
    let existingCounter = await counter.findOne({ _id: "tech_updates_Counter" })
    if (!existingCounter) {
      let counterDoc = new counter({
        _id: "thread_Counter",
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

const threadSchema = Schema({
  _id: Number,
  name: {
    type: String,
    lowercase: true,
    trim: true,
    sparse: true,
    required: true,
  },
  slug: {
    type: String,
  },
  postsCount: {
    type: Number,
    default: 0
  },
  locked: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category"
  },
  poll_question: {
    type: Schema.Types.ObjectId,
    ref: "PostQuestion"
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: "Post"
  }]
})

threadSchema.pre('save', async function (next) {
  try {
    let doc = this;
    if (doc.isNew) {
      let incCounter = await counter.findOneAndUpdate({ _id: 'thread_Counter' }, { $inc: { seq: 1 } }, { new: true });
      if (incCounter) {
        doc._id = incCounter.seq
        return next()
      }
      return next({ "message": "Couldn't Update the counter." })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = mongoose.model('Post', threadSchema)