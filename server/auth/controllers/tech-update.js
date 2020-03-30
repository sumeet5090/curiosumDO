const Event = require('../models/event.model')
const Response = require('../services/response')
const Team = require('../models/team.model')
const TechUpdate = require('../models/tech-update.model')
var ObjectId = require('mongoose').Types.ObjectId;
const Car = require('./../models/car.model')
const path = require('path')





const getOne = async (req, res) => {
  try {
    let id = req.params.id,
      $or = [{ event_short: id }]
    if (parseInt(id) == id) {
      $or.push({ _id: id })
    }
    let event = await Event.findOne({ $or: $or }).exec()
    if (event.length > 0) {
      let find_id = event.tech_updates.indexOf(req.params.tu_id)
      let out = await event.populate('tech_updates').exec()
      if (find_id > -1) {
        return Response.success(res, {
          tech_update: event.tech_updates[find_id]
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
    let event = await Event.findOne({ $or: $or }).populate({ path: 'tech_updates', populate: { path: 'team', populate: { path: 'cars', select: ['car_number', 'category'] } } }).exec()
    if (event) {
      return Response.success(res, {
        event: event
      })
    }
    return Response.failed(res, { message: "Not found" })
  } catch (error) {
    console.log(error)
    return res.send
    Status(500)
  }
}
const create = async (req, res) => {
  try {
    let event = await Event.findOne({ _id: req.params.id })
    let team = await Team.findOne({ _id: req.params.team_id }).populate('car').exec()
    let car = await Car.findOne({team: new ObjectId(req.params.team_id)})


    if (event && team && car) {
        let techUpdate1 = await TechUpdate.findOne({$and: [{event: event._id}, {team: team._id}]})
         if (techUpdate1) {
           return Response.failed(res, { message: "Team is already in tech updates" })
          }

      let techUpdate = await TechUpdate.findOne({ team: team._id, event: event._id, car: car._id })
      if (techUpdate) {
        techUpdate.accumulator = car.category === 'electric' ? req.body.accumulator : false
        techUpdate.scrutineering_elec = car.category === 'electric' ? req.body.scrutineering_elec : false
        techUpdate.scrutineering_mech = req.body.scrutineering_mech
        techUpdate.driver_egress = req.body.driver_egress
        techUpdate.tilt = req.body.tilt
        techUpdate.noise_ready_to_drive_sound = req.body.noise_ready_to_drive_sound
        techUpdate.brakes = req.body.brakes
        techUpdate.rain = req.body.rain
        let tu_saved = await techUpdate.save()
        if (tu_saved) {
          return Response.success(res, { message: "Successfully updated tech update." }, 200)
        }
        return Response.failed(res, { message: "This shouldn't have occured." })
      }
      techUpdate = await new TechUpdate({
        team: team._id,
        car: car._id,
        accumulator: car.category === 'electric' ? req.body.accumulator : false,
        scrutineering_elec: car.category === 'electric' ? req.body.scrutineering_elec : false,
        scrutineering_mech: req.body.scrutineering_mech,
        driver_egress: req.body.driver_egress,
        tilt: req.body.tilt,
        noise_ready_to_drive_sound: req.body.noise_ready_to_drive_sound,
        brakes: req.body.brakes,
        rain: req.body.rain,
        event: event._id
      }).save()
      if (techUpdate) {
        let out1 = await event.updateOne({ $push: { tech_updates: techUpdate._id } })
        let out2 = await team.updateOne({ $push: { tech_updates: techUpdate._id } })
        if (out1.nModified >= 1 && out1.ok == 1 && out2.nModified >= 1 && out2.ok == 1) {
          return Response.success(res, {
            message: "Created team update & linked to event."
          })
        }
        return Response.failed(res, {
          message: "Created team update, but couldn't link it to event."
        })
      }
      return Response.failed(res, {
        message: "Couldn't create team update."
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
  let tech_update, tu_id = req.params.tu_id, update_body
  try {
    tech_update = await TechUpdate.findOne({ _id: tu_id }).populate('team').exec()
    if (tech_update) {
      tech_update.accumulator = req.body.accumulator
      tech_update.scrutineering_elec = req.body.scrutineering_elec
      tech_update.scrutineering_mech = req.body.scrutineering_mech
      tech_update.driver_egress = req.body.driver_egress
      tech_update.tilt = req.body.tilt
      tech_update.noise_ready_to_drive_sound = req.body.noise_ready_to_drive_sound
      tech_update.brakes = req.body.brakes
      tech_update.rain = req.body.rain
      let saved = await tech_update.save()
      if (saved) {
        return Response.success(res, { message: "Updated tech update." })
      }
    }
    return Response.failed(res, { message: "Couldn't update tech update." })
  } catch (error) {
    console.log(error)
    return Response.failed(res, { message: "Internal server error." })
  }
}
const remove = async (req, res) => {
  let techupdt, event, id = req.params.id, tu_id = req.params.tu_id
  try {
    event = await Event.findOne({ _id: id })
    if (event) {
      techupdt = await TechUpdate.findOneAndDelete({ _id: tu_id })
      if (techupdt) {
        event.tech_updates.pull(techupdt._id)
        let saved = await event.save()
        if (saved) {
          return Response.success(res, { message: "Deleted tech update." })
        }
      }
    }
    return Response.failed(res, { message: "Couldn't delete tech update." })
  } catch (error) {
    console.log(error)
    return Response.failed(res, { message: "Internal server error." })
  }
}

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove
}
