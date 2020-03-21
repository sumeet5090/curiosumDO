const mongoose = require('mongoose')
const Schema = mongoose.Schema
const SchemaTypes = mongoose.SchemaTypes

const ruleSchema = Schema({
  name: String,
  notation: String,
  sub_rules: [{
    type: SchemaTypes.ObjectId,
    ref: 'SubRule'
  }],
  section: {
    type: SchemaTypes.ObjectId,
    ref: 'Section'
  }
})

module.exports = mongoose.model('Rule', ruleSchema)