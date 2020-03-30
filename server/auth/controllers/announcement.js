const Announcement = require('./../models/announcement.model')
const Event = require('./../models/event.model')
const Response = require('./../services/response')

const getOne = async (req, res) => {
  try {
    let id = req.params.id,
      $or = [{ event_short: id }]
    if (parseInt(id) == id) {
      $or.push({ _id: id })
    }
    let annc_id = req.params.annc_id
    let event = await Event.findOne({ $or: $or })
    if(event){
      let announcement = await Announcement.findOne({ _id: annc_id, event: event._id })
      if (announcement) {
        return Response.success(res, { message: "Announcement found.", announcement })
      }
    }
    return Response.failed(res, { message: "Announcement not found." })
  } catch (error) {
    console.log(error);
    return Response.failed(res, { message: "Internal server error." })
  }
}
const getAll = async (req, res) => {
  try {
    let id = req.params.id,
      $or = [{ event_short: id }]
    if (parseInt(id) == id) {
      $or.push({ _id: id })
    }
    let event = await Event.findOne({ $or: $or })
    if (event) {
      let announcements = await Announcement.find({ event: event._id }, null, { sort: { dateTime: 'desc' } }).populate('author').exec()
      if (announcements.length > 0) {
        return Response.success(res, {
          announcements: announcements
        })
      }
    }
    return Response.failed(res, {
      message: "Announcements not found."
    })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}
const create = async (req, res) => {
  try {
    let id = req.params.id,
      $or = [{ event_short: id }]
    if (parseInt(id) == id) {
      $or.push({ _id: id })
    }
    let event = await Event.findOne({ $or: $or })
    if (event) {
      let extractTags = []
      let new_ancmt = await new Announcement({
        event: event._id,
        dateTime: req.body.dateTime || Date.now(),
        author: req.body.author || req.user,
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags
      }).save()
      if (new_ancmt) {
        return Response.success(res, {
          message: "Created new announcement."
        })
      }
      return Response.failed(res, {
        message: "Couldn't create announcement."
      })
    }
    return Response.failed(res, {
      message: "No event found."
    })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}
const update = async (req, res) => {
  let announcement, annc_id = req.params.annc_id, body = req.body, update_body
  try {
    update_body = {
      dateTime: body.dateTime,
      author: body.author,
      title: body.title,
      description: body.description,
      author: body.author,
      tags: body.tags
    }
    announcement = await Announcement.findOneAndUpdate({ _id: annc_id }, update_body, { new: true })
    if (announcement) {
      return Response.success(res, { message: "Updated announcement.", announcement })
    }
    return Response.failed(res, { message: "Couldn't update announcement." })
  } catch (error) {
    console.log(error)
    return Response.failed(res, { message: "Internal server error." })
  }
}
const remove = async (req, res) => {
  let annc_id = req.params.annc_id, announcement
  try {
    announcement = await Announcement.findOneAndDelete({ _id: annc_id })
    if (announcement) {
      return Response.success(res, { message: "Deleted announcement." })
    }
    return Response.failed(res, { message: "Couldn't delete announcement." })
  } catch (error) {
    console.log(error)
    return Response.failed(res, { message: "Internal server error." })
  }
}
module.exports = {
  getOne,
  getAll,
  create,
  update,
  remove
}