const Event = require('./../models/event.model')
const Car = require('./../models/car.model')
const Team = require('./../models/team.model')
const Response = require('./../services/response')
const JSON2CSV = require('json-2-csv')
const crypto = require('crypto')
const path = require('path')
const { readFilesAsync, writeFilesAsync } = require('./../services/file')

const toArray = (num) => {
  if (Array.isArray(num)) {
    return num
  }
  return [num]
}

module.exports = {
  getAll: async (req, res) => {
    try {
      let id = req.params.id,
        $or = [{ event_short: id }]
      if (parseInt(id) == id) {
        $or.push({ _id: id })
      }
      let event = await Event.findOne({ $or: $or })
      if (event) {
        let cars = await Car.find({ event: event._id }).populate({
          path: 'team',
          populate: [{
            path: 'captain'
          }, {
            path: 'users'
          }]
        }).sort({
          car_number: 1,
          category: 1
        }).exec()
        if (cars) {
          if (cars.length > 0) {
            return Response.success(res, { cars: cars })
          }
          return Response.success(res, { cars: [] })
        }
      }
      return Response.failed(res, { message: "Not found" })
    } catch (error) {
      console.log(error)
      return Response.failed(res, { message: "Internal server error" }, 500)
    }
  },
  getForTeam: async (req, res) => {
    try {
      let id = req.params.id,
        $or = [{ event_short: id }]
      if (parseInt(id) == id) {
        $or.push({ _id: id })
      }
      let event = await Event.findOne({ $or: $or })
      let team = await Team.findOne({ _id: req.params.team_id })
      if (event && team) {
        let car = await Car.findOne({ event: event._id, team: team._id }).populate(['event', 'team']).exec()
        if (car) {
          return Response.success(res, { car: car })
        }
      }
      return Response.failed(res, { message: "Not found" })
    } catch (error) {
      console.log(error)
      return Response.failed(res, { message: "Internal server error" }, 500)
    }
  },
  batchDownload: async (req, res) => {
    const fields = [
      '_id',
      'event',
      'team',
      'car_number',
      'category',
    ]
    let id = req.params.id
    let $or = [{ event_short: id }]
    if (parseInt(id) == id) {
      $or.push({ _id: id })
    }
    let event = await Event.findOne({$or})
    if(event){
      console.log("Event found");
      let cars = Car.find({event: event._id})
      if(cars && cars.length > 0){
        let csv = await JSON2CSV.json2csvAsync(cars, {
          keys: fields,
          emptyFieldValue: '',
          expandArrayObjects: true
        })
        if(csv){
          console.log("CSV");
          
        }
      }
    }
  },
  batchCreateFromCSV: async (req, res) => {
    const fields = [
      '_id', // Event ID
      'car_number',
      'category',
      'team.name',
      'team.institution.name',
      'team.institution.address',
      'team.institution.short',
      'team_captain_email',
      'team_captain_full_name',
      'country',
      'social.facebook',
      'social.instagram',
      'social.twitter',
      'website_url',
    ]
    let id = req.params.id
    let $or = [{ event_short: id }]
    if (parseInt(id) == id) {
      $or.push({ _id: id })
    }
    if (req.files && req.files.file) {
      let file = req.files.file
      if (file && file.data) {
        let csv = file.data.toString('utf8')
        let data = await JSON2CSV.csv2jsonAsync(csv, {
          keys: fields,
          emptyFieldValue: '',
          expandArrayObjects: true
        })
        if (data) {
          let dataArr = toArray(data)
          let doneCars = []
          let doneTeams = []
          let event = await Event.findOne({ $or: $or })
          if (event) {
            for (let i = 0; i < dataArr.length; i++) {
              let d = dataArr[i]
              if (d) {
                let car = await new Car({
                  car_number: d.car_number,
                  event: event._id
                }).save()
                if (car) {
                  let team = await Team.findOneAndUpdate({ _id: d._id }, { $push: { cars: car._id } })
                  if (team) {
                    let new_car = await Car.findOneAndUpdate({ _id: car._id }, { team: team._id })
                    doneTeams.push(team._id)
                    doneCars.push(new_car._id)
                  } else {
                    let new_team = await new Team({
                      team_name: d.team.name,
                      institution: {
                        name: d.institution.name,
                        address: d.institution.address,
                        short_name: d.institution.short_name,
                      },
                      social: {
                        facebook: d.social.facebook,
                        twitter: d.social.twitter,
                        instagram: d.social.instagram,
                      },
                      website_url: d.website_url,
                      team_captain_email: d.team_captain_email,
                      team_captain_full_name: d.team_captain_full_name,
                      country: d.country,
                      cars: [car._id]
                    }).save()
                    if (new_team) {
                      let updated_car = await Car.findOneAndUpdate({ _id: car._id }, { team: team._id })
                      doneTeams.push(new_team._id)
                      doneCars.push(updated_car._id)
                    }
                  }
                }
              }
            }
            if (dataArr.length == doneCars.length) {
              let updateEvent = await event.update({ cars: doneCars }).exec()
              if (updateEvent) {
                console.log("Event updated with cars " + doneCars.length);
                return Response.success(res, { message: "Event updated" })
              }
            }
          }
          return Response.failed(res, { message: "Couldn't update event" })
        }
      }
      return Response.failed(res, { message: "No data." })
    }

    try {
      let event = await Event.findOne({ $or: $or })
      if (event) {
        return Response.success(res, { car: event })
      }
    } catch (error) {
      console.log(error);
      return Response.failed(res, { message: "Internal server error" }, 500)
    }
  },
  create: async (req, res) => {
    try {
      let id = req.params.id,
        $or = [{ event_short: id }]
      if (parseInt(id) == id) {
        $or.push({ _id: id })
      }
      let team_id = req.params.team_id
      let event = await Event.findOne({ $or: $or })
      let team = await Team.findOne({ _id: team_id })
      if (team && event) {
        let car = await new Car({
          car_number: req.body.car_number,
          category: req.body.category,
          event: event._id,
          team: team._id,
        }).save()
        if (car) {
          let updateEvent = await event.updateOne({ $push: { cars: car._id } })
          let updateTeam = await team.updateOne({ $push: { cars: car._id } })
          if (updateEvent.nModified >= 1 && updateEvent.ok == 1 && updateTeam.nModified >= 1 && updateTeam.ok) {
            return Response.success(res, { message: "Created car" })
          }
        }
        return Response.failed(res, { message: "Couldn't create car." })
      }
      return Response.failed(res, { message: "Not found" })
    } catch (error) {
      console.log(error);
      return Response.failed(res, { message: "Internal server error" }, 500)
    }
  },
  update: async (req, res) => {
    try {
      let id = req.params.id,
        $or = [{ event_short: id }],
        team_id = req.params.team_id
      if (parseInt(id) == id) {
        $or.push({ _id: id })
      }
      let event = await Event.findOne({ $or: $or })
      if (event) {
        let car = await Car.findOneAndUpdate({ team: team_id, event: event._id }, { car_number: req.body.car_number, category: req.body.category }, { upsert: true, new: true })
        if (car) {
          return Response.success(res, { message: "Car updated" })
        }
      }
      return Response.failed(res, { message: "Not found" })
    } catch (error) {
      console.log(error)
      return Response.failed(res, { message: "Internal server error" }, 500)
    }
  },
  remove: async (req, res) => {
    try {
      let id = req.params.id,
        $or = [{ event_short: id }],
        team_id = req.params.team_id
      if (parseInt(id) == id) {
        $or.push({ _id: id })
      }
      let event = await Event.findOne({ $or: $or })
      if (event) {
        let car = await Car.findOneAndDelete({ team: team_id, event: event._id })
        if(car){
          let team = await Team.findOneAndUpdate({_id: team_id}, { $pull: { cars: car._id }})
          let eventUpdate = await Event.findOneAndUpdate({_id: event._id}, { $pull: { cars: car._id }})
          if (team && eventUpdate) {
            return Response.success(res, { message: "car updated" })
          }
        }
      }
      return Response.failed(res, { message: "not found" })
    } catch (err) {
      console.log(err);
      return Response.failed(res, { message: "Internal server error" })
    }
  },
}