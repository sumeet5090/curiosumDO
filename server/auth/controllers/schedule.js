const Event = require('./../models/event.model')
const Schedule = require('./../models/schedule.model')
const Response = require('./../services/response')

const getOneSchedule = async (req, res) => {
  try {
    let id = req.params.id,
      $or = [{ event_short: id }]
    if (parseInt(id) == id) {
      $or.push({ _id: id })
    }
    let event = await Event.findOne({ $or: $or })
    if (event.length > 0) {
      let find_id = event.schedules.indexOf(req.params.id)
      if (find_id > -1) {
        let out = await event.populate('schedules').exec()
        return Response.success(res, {
          schedules: out.schedules[find_id]
        })
      }
    }
    return Response.failed(res, { message: "Not found" })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}
const getAllSchedules = async (req, res) => {
  try {
    let id = req.params.id,
      $or = [{ event_short: id }]
    if (parseInt(id) == id) {
      $or.push({ _id: id })
    }
    let schedules
    let isAuthenticated = req.isAuthenticated() || false
    let event = await Event.findOne({ $or: $or })
    if (isAuthenticated) {
      let user_roles = req.user.role
      if (user_roles.contains('admin') || user_roles.contains('staff')) {
        schedules = await Schedule.find({ event_id: event._id })
      } else if (user_roles.contains('participant') && user_roles.contains('volunteer')) {
        schedules = await Schedule.find({ event_id: event._id, $or: [{ volunteer_view: true }, { participant_view: true }, { visitor_view: true }] })
      } else if (user_roles.contains('volunteer') && !user_roles.contains('participant')) {
        schedules = await Schedule.find({ event_id: event._id, $or: [{ volunteer_view: true }, { visitor_view: true }] })
      } else if (!user_roles.contains('volunteer') && user_roles.contains('participant')) {
        schedules = await Schedule.find({ event_id: event._id, $or: [{ participant_view: true }, { visitor_view: true }] })
      } else {
        schedules = await Schedule.find({ event_id: event._id, visitor_view: true })
      }
    } else {
      schedules = await Schedule.find({ event_id: event._id, visitor_view: true })
    }
    if (schedules.length > 0) {
      event.schedules = schedules
      return Response.success(res, { event: event })
    }
    return Response.failed(res, { message: "Not found" })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}
const createSchedule = async (req, res) => {
  try {
    let event = await Event.findOne({ _id: req.params.id }), body = req.body
    if (event) {
      let schedule = await new Schedule({
        day_number: body.day_number,
        day: body.day,
        date: body.date,
        activity: body.activity,
        start_time: body.start_time,
        end_time: body.end_time,
        location: body.location,
        comments: body.comments,
        restriction: body.restriction,
        volunteer_view: body.volunteer_view,
        participant_view: body.participant_view,
        visitor_view: body.visitor_view,
        event_id: event._id
      }).save()
      if (schedule) {
        let out = await event.updateOne({ $push: { schedules: schedule } })
        if (out.nModified >= 1 && out.ok == 1) {
          return Response.success(res, { message: "Created schedule!" }, 200)
        }
        return Response.failed(res, {
          message: "Created schedule, but couldn't link it to event."
        }, 200)
      }
      return Response.failed(res, {
        message: "Couldn't create schedule"
      })
    }
    return Response.failed(res, {
      message: "Event not found."
    })
  } catch (error) {
    console.log(error)
    return Response.failed(res, { message: "Internal server error." }, 500)
  }
}
const updateSchedule = async (req, res) => {
  let schedule, sc_id = req.params.sc_id, update_body
  try {
    update_body = {
      day_number: req.body.day_number,
      day: req.body.day,
      date: req.body.date,
      activity: req.body.activity,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      location: req.body.location,
      comments: req.body.comments,
      volunteer_view: req.body.volunteer_view,
      participant_view: req.body.participant_view,
      visitor_view: req.body.visitor_view
    }
    schedule = await Schedule.findOneAndUpdate({ _id: sc_id }, update_body, { new: true })
    if (schedule) {
      return Response.success(res, { schedule: schedule })
    }
    return Response.failed(res, { message: "Couldn't update schedule." })
  } catch (error) {
    console.log(error)
    return Response.failed(res, { message: "Internal server error." })
  }
}
const deleteSchedule = async (req, res) => {
  let schedule, event, id = req.params.id, sc_id = req.params.sc_id
  try {
    event = await Event.findOne({ _id: id })
    if (event) {
      schedule = await Schedule.findOneAndDelete({ _id: sc_id })
      if (schedule) {
        event.schedules.pull(schedule._id)
        let saved = await event.save()
        if (saved) {
          return Response.success(res, { message: "Deleted schedule." })
        }
      }
    }
    return Response.failed(res, { message: "Couldn't delete schedule." })
  } catch (error) {
    console.log(error)
    return Response.failed(res, { message: "Internal server error." })
  }
}

module.exports = {
  getOneSchedule,
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
}