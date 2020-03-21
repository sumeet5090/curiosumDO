const Event = require('./../models/event.model')
const Review = require('./../models/review.model')
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
      let find_id = event.review.indexOf(req.params.id)
      let out = await event.populate('tech_updates').exec()
      if (find_id > -1) {
        return Response.success(res, {
          review: out.review[find_id]
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
    let event = await Event.findOne({ $or: $or }).populate({ path: 'review', populate: { path: 'team_id', populate: { path: 'car', select: 'car_number' } } }).exec()
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
        let review = await new Review({
          team_id: team._id,
          event_name: req.body.event_name,
          lap_number: req.body.lap_number,
          lap_time: req.body.lap_time,
          driver_initial: req.body.driver_initial,
          event_id: event._id
        }).save()
        if (review) {
          let out = await event.updateOne({ $push: { review: review._id } })
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
  let review, lt_id = req.params.lt_id, update_body
  try {
    update_body = {
      event_name: req.body.event_name,
      lap_number: req.body.lap_number,
      lap_time: req.body.lap_time,
      driver_initial: req.body.driver_initial
    }
  review = await Review.findOneAndUpdate({ _id: lt_id }, update_body, { new: true })
    if (review) {
      return Response.success(res, { review: review, message: "Updated live timing." })
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
    event, review
  try {
    event = await Event.findOne({ _id: id })
    if (event) {
      review = await Review.findOneAndDelete({ _id: lt_id })
      if (review) {
        event.review.pull(review._id)
        let saved = await event.save()
        if (saved) {
          return Response.success(res, { message: `Successfully deleted live timing $ review._id}` })
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
