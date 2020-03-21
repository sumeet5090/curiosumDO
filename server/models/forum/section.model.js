const mongoose = require('mongoose')
const Schema = mongoose.Schema
const SchemaTypes = mongoose.SchemaTypes

const sectionSchema = Schema({
  name: String,
  notation: String,
  rules: [{
    type: SchemaTypes.ObjectId,
    ref: 'Rule'
  }],
  event: {
    type: Number,
    ref: 'Event'
  }
})

module.exports = mongoose.model('Section', sectionSchema)