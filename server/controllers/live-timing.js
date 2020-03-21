const Event = require('./../models/event.model')
const LiveTiming = require('./../models/livetiming.model')
const Response = require('./../services/response')
const Team = require('./../models/team.model')

const getOne = async (req, res) => {
  try {
    let id = req.params.id,
      $or = [{ event_short: id }]
    if (parseInt(id) == id) {
      $or.push({ _id: id })
    }
    let event = await Event.findOne({ $or: $or })
    if (event && event.length > 0) {
      let find_id = event.live_timings.indexOf(req.params.id)
      let out = await event.populate('tech_updates').exec()
      if (find_id > -1) {
        return Response.success(res, {
          live_timings: out.live_timings[find_id]
        })
      }
    }
    return Response.failed(res, { message: "Not found" })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}
const getAll = async (req, res) => {
  try {
    let id = req.params.id,
      $or = [{ event_short: id }]
    if (parseInt(id) == id) {
      $or.push({ _id: id })
    }
    let event = await Event.findOne({ $or: $or }).populate({ path: 'live_timings', populate: { path: 'team_id', populate: { path: 'car', select: 'car_number' } } }).exec()
    if (event) {
      return Response.success(res, {
        event: event
      })
    }
    return Response.failed(res, { message: "Not found" })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}
const create = async (req, res) => {
  try {
    let event = await Event.findOne({ _id: req.params.id })
    if (event) {
      let team = await Team.findOne({ _id: req.params.team_id })
      if (team) {
        let liveTiming = await new LiveTiming({
          team_id: team._id,
          event_name: req.body.event_name,
          lap_number: req.body.lap_number,
          lap_time: req.body.lap_time,
          driver_initial: req.body.driver_initial,
          event_id: event._id
        }).save()
        if (liveTiming) {
          let out = await event.updateOne({ $push: { live_timings: liveTiming._id } })
          if (out.nModified >= 1 && out.ok == 1) {
            return Response.success(res, {
              message: "Created live timing & linked to event."
            })
          }
          return Response.failed(res, {
            message: "Created live timing, but couldn't link it to event."
          })
        }
        return Response.failed(res, {
          message: "Couldn't create live timing."
        })
      }
    }
    return res.sendStatus(404)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}
const update = async (req, res) => {
  let live_timing, lt_id = req.params.lt_id, update_body
  try {
    update_body = {
      event_name: req.body.event_name,
      lap_number: req.body.lap_number,
      lap_time: req.body.lap_time,
      driver_initial: req.body.driver_initial
    }
    live_timing = await LiveTiming.findOneAndUpdate({ _id: lt_id }, update_body, { new: true })
    if (live_timing) {
      return Response.success(res, { live_timing: live_timing, message: "Updated live timing." })
    }
    return Response.failed(res, { message: "Couldn't update live timing." })
  } catch (error) {
    console.log(error)
    return Response.failed(res, { message: "Internal server error." })
  }
}
const remove = async (req, res) => {
  let id = req.params.id,
    lt_id = req.params.lt_id,
    event, live_timing
  try {
    event = await Event.findOne({ _id: id })
    if (event) {
      live_timing = await LiveTiming.findOneAndDelete({ _id: lt_id })
      if (live_timing) {
        event.live_timings.pull(live_timing._id)
        let saved = await event.save()
        if (saved) {
          return Response.success(res, { message: `Successfully deleted live timing ${live_timing._id}` })
        }
      }
      return Response.failed(res, { message: "Couldn't delete live timing." })
    }
    return Response.failed(res, { message: "Event not found." })
  } catch (error) {
    console.log(error)
    return Response.failed(res, "Internal server error.")
  }
}

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove
}