const mongoose = require('mongoose')
const Schema = mongoose.Schema
const SchemaTypes = mongoose.SchemaTypes

const subRuleSchema = Schema({
  notation: String,
  name: String,
  rule: {
    type: SchemaTypes.ObjectId,
    ref: 'Rule'
  },
})

module.exports = mongoose.model('SubRule', subRuleSchema)