const Event = require('./../models/event.model')
const StaticSchedule = require('./../models/static_schedule.model')
const Team = require('./../models/team.model')
const Response = require('./../services/response')

const getAll = async (req, res) => {
  let schedules, event_id = req.params.id,
    $or = [{ event_short: event_id }]
  if (parseInt(event_id) == event_id) {
    $or.push({ _id: event_id })
  }
  try {
    let event = await Event.findOne({ $or }).populate({ path: 'static_schedule', populate: { path: 'team' } }).exec()
    if (event.static_schedule) {
      if (event.static_schedule.length > 0) {
        return Response.success(res, { static_schedules: event.static_schedule })
      }
      return Response.success(res, { static_schedules: [] })
    }
    return Response.failed(res, { message: "Couldn't get static schedules." })
  } catch (error) {
    console.log(error)
    return Response.failed(res, { message: "Internal server error." })
  }
}
const getAllForTeam = async (req, res) => {
  let schedules, team_id = req.params.team_id;
  try {
    schedules = await StaticSchedule.find({ team: team_id })
    if (schedules) {
      if (schedules.length > 0) {
        return Response.success(res, { static_schedules: schedules })
      }
      return Response.success(res, { static_schedules: [] })
    }
    return Response.failed(res, { message: "Couldn't get static schedules." })
  } catch (error) {
    console.log(error)
    return Response.failed(res, { message: "Internal server error." })
  }
}
const getAllForEvent = async (req, res) => {
  let schedules, event_id = req.params.id,
    $or = [{ event_short: event_id }]
  if (parseInt(event_id) == event_id) {
    $or.push({ _id: event_id })
  }
  try {
    let event = await Event.findOne({ $or }).populate({ path: 'static_schedule', populate: { path: 'team' } }).exec()
    if (event.static_schedule) {
      if (event.static_schedule.length > 0) {
        return Response.success(res, { static_schedules: event.static_schedule })
      }
      return Response.success(res, { static_schedules: [] })
    }
    return Response.failed(res, { message: "Couldn't get static schedules." })
  } catch (error) {
    console.log(error)
    return Response.failed(res, { message: "Internal server error." })
  }
}
const getOne = async (req, res) => {
  let stSchedule, st_id = req.params.st_id, team
  try {
    stSchedule = await StaticSchedule.findOne({ _id: st_id })
    if (stSchedule) {
      return Response.success(res, { static_schedule: stSchedule })
    }
    return Response.failed(res, { message: "Couldn't get static schedules" })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}
const getOneForEventTeam = async (req, res) => {
  try {
    let event = await Event.findOne({_id: req.params.id})
    let team = await Team.findOne({_id: req.params.team_id})
    if(event && team) {
      let static_schedule = await StaticSchedule.findOne({event: event._id, team: team._id})
      if(static_schedule){
        return Response.success(res, {static_schedule})
      }
    }
    return Response.failed(res, {message: "Not found."})
  } catch (error) {
    console.log(error);
    return Response.failed(res, {message: "Internal server error."})
  }
}
const create = async (req, res) => {
  try {
    let event = await Event.findOne({ _id: req.params.id })
    let team = await Team.findOne({ _id: req.params.team_id }).populate('car').exec()
    if (event && team) {
      let staticSchedule = await StaticSchedule.findOne({ team: team._id, event: event._id })
      if (staticSchedule) {
        staticSchedule.business.queue = req.body.business_queue
        staticSchedule.business.start_time = req.body.business_start_time
        staticSchedule.business.end_time = req.body.business_end_time
        staticSchedule.cost.queue = req.body.cost_queue
        staticSchedule.cost.start_time = req.body.cost_start_time
        staticSchedule.cost.end_time = req.body.cost_end_time
        staticSchedule.design.queue = req.body.design_queue
        staticSchedule.design.start_time = req.body.design_start_time
        staticSchedule.design.end_time = req.body.design_end_time
        let st_saved = await staticSchedule.save()
        if (st_saved) {
          return Response.success(res, { message: "Successfully updated tech update." }, 200)
        }
        return Response.failed(res, { message: "This shouldn't have occured." })
      }
      staticSchedule = await new StaticSchedule({
        event: event._id,
        team: team._id,
        business: {
          queue: body.business_queue,
          start_time: body.business_start_time,
          end_time: body.business_end_time
        },
        cost: {
          queue: body.cost_queue,
          start_time: body.cost_start_time,
          end_time: body.cost_end_time
        },
        design: {
          queue: body.design_queue,
          start_time: body.design_start_time,
          end_time: body.design_end_time
        }
      }).save()
      if (staticSchedule) {
        let out1 = await event.updateOne({ $push: { static_schedule: staticSchedule._id } })
        let out2 = await team.updateOne({ $push: { static_schedule: staticSchedule._id } })
        if (out1.nModified >= 1 && out1.ok == 1 && out2.nModified >= 1 && out2.ok == 1) {
          return Response.success(res, {
            message: "Created static schedule & linked to event."
          })
        }
        return Response.failed(res, {
          message: "Created static schedule, but couldn't link it to event."
        })
      }
      return Response.failed(res, {
        message: "Couldn't create static schedule."
      })
    }
    return Response.failed(res, {
      message: "Event not found."
    })
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}
const update = async (req, res) => {
  let static_schedule, st_id = req.params.st_id, update_body
  try {
    update_body = {
      business: {
        queue: req.body.business_queue,
        start_time: req.body.business_start_time,
        end_time: req.body.business_end_time
      },
      cost: {
        queue: req.body.cost_queue,
        start_time: req.body.cost_start_time,
        end_time: req.body.cost_end_time
      },
      design: {
        queue: req.body.design_queue,
        start_time: req.body.design_start_time,
        end_time: req.body.design_end_time
      }
    }
    static_schedule = await StaticSchedule.findOneAndUpdate({ _id: st_id }, update_body, { new: true })
    if (static_schedule) {
      return Response.success(res, { static_schedule })
    }
    return Response.failed(res, { message: "Couldn't update statuc schedule." })
  } catch (error) {
    console.log(error)
    return Response.failed(res, { message: "Internal server error." })
  }
}
const remove = async (req, res) => {
  let st_schedule, event, id = req.params.id, st_id = req.params.st_id
  try {
    event = await Event.findOne({ _id: id })
    if (event) {
      st_schedule = await StaticSchedule.findOneAndDelete({ _id: st_id })
      if (st_schedule) {
        let team = await Team.findOne({ _id: st_schedule.team })
        if (team) {
          await event.static_schedule.pull(st_id)
          await team.static_schedules.pull(st_id)
          let saved_e = await event.save()
          let saved_t = await team.save()
          if (saved_e && saved_t) {
            return Response.success(res, { message: "Removed static schedule." })
          }
        }
        return Response.failed(res, { message: "Couldn't find team." })
      }
      return Response.failed(res, { message: "Couldn't delete static schedule." })
    }
    return Response.failed(res, { message: "Couldn't find event." })
  } catch (error) {
    console.log(error)
    return Response.failed(res, { message: "Internal server error." })
  }
}
module.exports = {
  getAll,
  getAllForTeam,
  getAllForEvent,
  getOneForEventTeam,
  getOne,
  create,
  update,
  remove
}