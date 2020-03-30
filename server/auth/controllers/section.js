const Section = require('./../models/forum/section.model')
const Rule = require('./../models/forum/rule.model')
const Event = require('./../models/event.model')
const SubRule = require('./../models/forum/sub-rule.model')
const Response = require('./../services/response')
const getOne = async function (req, res) { }

const getAll = async function (req, res) {
  try {
    let id = req.params.id,
      $or = [{ event_short: id }]
    if (parseInt(id) == id) {
      $or.push({ _id: id })
    }
    let event = await Event.findOne({ $or: $or })
    if (event) {
      let sections = await Section.find({ event: event._id }).populate({ path: 'rules', populate: { path: 'sub_rules' } }).exec()
      if (sections && sections.length > 0) {
        return Response.success(res, { sections })
      }
    }
    return Response.success(res, { sections: [] })
  } catch (error) {
    console.log(error)
    return Response.failed(res, { sections: [] })
  }
}

module.exports = {
  getOne,
  getAll
}