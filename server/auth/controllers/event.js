const Event = require('./../models/event.model')
const Car = require('./../models/car.model')
const Schedule = require('./../models/schedule.model')
const Team = require('./../models/team.model')
const StaticSchedule = require('./../models/static_schedule.model')
const mongoose = require('mongoose')
const Response = require('./../services/response')
const { readFilesAsync, writeFilesAsync } = require('./../services/file')
const JSON2CSV = require('json-2-csv')
const crypto = require('crypto')
const path = require('path')

const toArray = (num) => {
  if (Array.isArray(num)) {
    return num
  }
  return [num]
}

const toBoolean = (val) => {
  if (val === "TRUE" || val === "true" || val === true || val === 1) {
    return true
  }
  return false
}

const getAllEvents = async (req, res) => {
  try {
    let events = await Event.find().sort({ start_date: 'descending' }).populate('organizers').exec()
    if (events.length > 0) {
      return Response.success(res, {
        events: events
      })
    }
    return Response.failed(res, {
      message: "No events found."
    })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

const getCurrentEvents = async (req, res) => {
  try {
    const date = new Date();
    let events = await Event.find({ start_date: {$gte: date } }).sort({ start_date: 'descending' }).populate('organizers').exec()
    if (events.length > 0) {
      return Response.success(res, {
        events: events
      })
    }
    return Response.failed(res, {
      message: "No events found."
    })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}


const getSpecialEvent = async (req, res) => {
  try {
    const name = 'Formula Bharat 2020';
    let event = await Event.findOne({ name: name }).exec()
    if (event) {
      return Response.success(res, {
        event: event
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

const getOneEvent = async (req, res) => {
  try {
    let id = req.params.id,
      $or = [{ event_short: id }]
    if (parseInt(id) == id) {
      $or.push({ _id: id })
    }
    let event = await Event.findOne({ $or: $or }).exec()
    if (event) {
      return Response.success(res, {
        event: event
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


const getOneEventByName = async (req, res) => {
  try {
    let event = await Event.findOne({ event_short: req.params.event_name })
    if (event) {
      return Response.success(res, {
        event: event
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
const getTeamForEvent = async (req, res) => {
  try {
    let id = req.params.id,
      $or = [{ event_short: id }]
    if (parseInt(id) == id) {
      $or.push({ _id: id })
    }
    let event = await Event.findOne({ $or: $or }).populate('teams').populate({ path: 'teams', populate: { path: 'car', select: 'car_number' } }).populate({ path: 'teams', populate: { path: 'users' } }).exec()
    if (event) {
      if (event.teams.length > 0) {
        return Response.success(res, {
          teams: event.teams
        })
      }
      return Response.failed(res, {
        message: "Event has no teams."
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

const getAllCars = async (req, res) => {
  try {
    let cars = await Car.find()
    if (cars) {
      if (cars.length > 0) {
        return Response.success(res, {
          cars: cars
        })
      }
    }
    return Response.failed(res, {
      message: "No cars"
    })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

const getCarsCSV = async (req, res) => {
  const fields = [
    '_id',
    'team',
    'event',
    'category',
    'car_number',
  ]
  try {
    let id = req.params.id,
      $or = [{ event_short: id }]
    if (parseInt(id) == id) {
      $or.push({ _id: id })
    }
    let event = await Event.findOne({ $or: $or })
    if (event) {
      let cars = await Car.find({ event: event._id })
      if (cars) {
        let csv = await JSON2CSV.json2csvAsync(JSON.parse(JSON.stringify(cars)), {
          keys: fields,
          emptyFieldValue: '',
          eol: '\\r\\n',
          expandArrayObjects: true
        })
        if (csv) {
          let fname = `downloads/event-${event.event_short}-cars-${crypto.randomBytes(8).toString('hex')}.csv`
          console.log(fname);
          let filename = path.resolve(fname)
          let file = await writeFilesAsync(fname, csv)
          if (file) {
            res.locals.filename = fname
            return res.sendFile(filename)
          }
          return Response.failed(res, { message: "No file." })
        }
      }
    }
    return Response.failed(res, { message: "Not found." })
  } catch (error) {
    console.log(error);
    return Response.failed(res, { message: "Some internal error." })
  }
}

const updateCarsFromCSV = async (req, res) => {
  const fields = [
    '_id',
    'car_number',
    'team',
    'event',
    'category'
  ]
  try {
    let id = req.params.id,
      $or = [{ event_short: id }]
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
          eol: '\\r\\n',
          expandArrayObjects: true
        })
        if (data) {
          let dataArr = toArray(data)
          for (let i = 0; i < data.length; i++) {
            let inCar = JSON.parse(JSON.stringify((data[i])))
            let {_id, team, event, car_number, category} = inCar
            let dbTeam = await Team.findOne({ _id: team })
            let dbEvent = await Event.findOne({ _id: event })
            if (dbTeam && dbEvent) {
              if (_id !== null) {
                console.log("Updating exisitng car, ", _id);
                let car = await Car.findOne({ _id: _id })
                if (car) {
                  let carTeam = await Team.findOneAndUpdate({ _id: car.team }, { $pull: { cars: car._id } })
                  let carEvent = await Event.findOneAndUpdate({ _id: car.event }, { $pull: { cars: car._id } })
                  if (carTeam && carEvent) {
                    console.log("Updated car event and car team (pulled old entries)");
                    car.team = dbTeam._id
                    car.event = dbEvent._id
                    car.car_number = car_number
                    car.category = category
                    let saved = await car.save()
                    if (saved) {
                      console.log("SAved exisiting car with updated teams!");
                      dbTeam.cars.push(car._id)
                      dbEvent.cars.push(car._id)
                      let updatedT = await dbTeam.save()
                      let updatedE = await dbEvent.save()
                      if (updatedT) {
                        console.log("Linked team to existing car.");
                      }
                      if (updatedE) {
                        console.log("Linked event to existing car.");
                      }
                    }
                  }
                }
              } else {
                console.log("Creating new car");
                let new_car = await new Car({
                  car_number,
                  category,
                  team: dbTeam._id,
                  event: dbEvent._id,
                }).save()
                if (new_car) {
                  console.log("Created new car: ", new_car._id);
                  console.log("Linking team and event");
                  dbTeam.cars.push(new_car._id)
                  dbEvent.cars.push(new_car._id)
                  let updatedT = await dbTeam.save()
                  let updatedE = await dbEvent.save()
                  if (updatedT) {
                    console.log("Linked team");
                  }
                  if (updatedE) {
                    console.log("Linked event");
                  }
                }
              }
            }
          }
          return Response.success(res, { message: "Success? Check and confirm." })
        }
      }
      return Response.failed(res, { message: "No file data" })
    }
    return Response.failed(res, { message: "No file" })
  } catch (err) {
    console.log(err);
    return Response.failed(res, { message: "Internal server error" })
  }
}

const getAllEventsByCSV = async (req, res) => {
  const fields = [
    '_id',
    'name',
    'venue',
    'link',
    'start_date',
    'end_date',
    'event_short',
    'past',
    'show_block.official_website',
    'show_block.teams',
    'show_block.live_announcements',
    'show_block.rules',
    'show_block.schedule',
    'show_block.tech_inspection',
    'show_block.live_timings',
    'organizers',
    'teams',
    'schedules',
    'live_timings',
    'tech_updates',
    'static_schedule',
  ]
  try {
    let events = await Event.find()
    if (events) {
      let csv = await JSON2CSV.json2csvAsync(JSON.parse(JSON.stringify(events)), {
        keys: fields,
        emptyFieldValue: '',
        expandArrayObjects: true
      })
      if (csv) {
        let fname = `downloads/all-events-${crypto.randomBytes(8).toString('hex')}.csv`
        console.log(fname);
        let filename = path.resolve(fname)
        let file = await writeFilesAsync(fname, csv)
        if (file) {
          res.locals.filename = fname
          return res.sendFile(filename)
        }
        return Response.failed(res, { message: "No file." })
      }
    }
    return Response.failed(res, { message: "Not found." })
  } catch (error) {
    console.log(error);
    return Response.failed(res, { message: "Some internal error." })
  }
}

const getTeamsCSVForEvent = async (req, res) => {
  const fields = [
    '_id',
    'name',
    'venue',
    'link',
    'start_date',
    'end_date',
    'event_short',
    'past',
    'show_block.official_website',
    'show_block.teams',
    'show_block.live_announcements',
    'show_block.rules',
    'show_block.schedule',
    'show_block.tech_inspection',
    'show_block.live_timings',
    'organizers',
    'teams',
    'schedules',
    'live_timings',
    'tech_updates',
    'static_schedule',
  ]
  let id = req.params.id,
    $or = [{ event_short: id }]
  if (parseInt(id) == id) {
    $or.push({ _id: id })
  }
  try {
    let event = await Event.findOne({ $or: $or })
    if (event) {
      console.log("Event found");
      let csv = await JSON2CSV.json2csvAsync(JSON.parse(JSON.stringify([event])), {
        keys: fields,
        emptyFieldValue: '',
        expandArrayObjects: true
      })
      if (csv) {
        console.log("CSV");
        let fname = `downloads/event-${id}-${crypto.randomBytes(8).toString('hex')}.csv`
        console.log(fname);
        let filename = path.resolve(fname)
        let file = await writeFilesAsync(fname, csv)
        if (file) {
          res.locals.filename = fname
          return res.sendFile(filename)
        }
        return Response.failed(res, { message: "No file." })
      }
      return Response.failed(res, { message: "No csv." })
    }
    return Response.failed(res, { message: "Not found." })
  } catch (error) {
    console.log(error);
    return Response.failed(res, { message: "Some internal error." })
  }
}

const updateEventFromCSV = async (req, res) => {
  const fields = [
    '_id',
    'name',
    'venue',
    'link',
    'start_date',
    'end_date',
    'event_short',
    'past',
    'show_block.official_website',
    'show_block.teams',
    'show_block.live_announcements',
    'show_block.rules',
    'show_block.schedule',
    'show_block.tech_inspection',
    'show_block.live_timings',
    'organizers',
    'teams',
    'schedules',
    'live_timings',
    'tech_updates',
    'static_schedule',
  ]
  let id = req.params.id,
    $or = [{ event_short: id }]
  if (parseInt(id) == id) {
    $or.push({ _id: id })
  }
  try {
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
          let inEvent = JSON.parse(JSON.stringify(dataArr[0]))
          let teams = toArray(inEvent.teams),
            schedules = toArray(inEvent.schedules),
            live_timings = toArray(inEvent.live_timings),
            tech_updates = toArray(inEvent.tech_updates),
            static_schedule = toArray(inEvent.static_schedule),
            show_block = inEvent.show_block
          let updateEvent = {
            name: inEvent.name,
            venue: inEvent.venue,
            link: inEvent.link,
            start_date: inEvent.start_date,
            end_date: inEvent.end_date,
            event_short: inEvent.event_short,
            past: toBoolean(inEvent.past),
            show_block: {
              official_website: toBoolean(show_block.official_website),
              teams: toBoolean(show_block.teams),
              live_announcements: toBoolean(show_block.live_announcements),
              rules: toBoolean(show_block.rules),
              schedule: toBoolean(show_block.schedule),
              tech_inspection: toBoolean(show_block.tech_inspection),
              live_timings: toBoolean(show_block.live_timings)
            },
            teams,
            schedules,
            live_timings,
            tech_updates,
            static_schedule,
          }
          let updatedEvent = await Event.findOneAndUpdate({ _id: inEvent._id }, updateEvent, { new: true })
          if (updatedEvent) {
            console.log("Updated event");
            let dbTeams = await Team.updateMany({ _id: { $in: teams } }, { $addToSet: { events: [updatedEvent._id] } })
            if (dbTeams) {
              return Response.success(res, { message: "Updated event.", event: updatedEvent })
            }
            return Response.failed(res, { message: "Not updated teams." })
          }
          return Response.failed(res, { message: "Not updated event." })
        }
        return Response.failed(res, { message: "No data." })
      }
      return Response.failed(res, { message: "No data." })
    }
    return Response.failed(res, { message: "Not found." })
  } catch (error) {
    console.log(error);
    return Response.failed(res, { message: "Some internal error." })
  }
}

const updateEventsFromCSV = async (req, res) => {
  const fields = [
    '_id',
    'name',
    'venue',
    'link',
    'start_date',
    'end_date',
    'event_short',
    'past',
    'show_block.official_website',
    'show_block.teams',
    'show_block.live_announcements',
    'show_block.rules',
    'show_block.schedule',
    'show_block.tech_inspection',
    'show_block.live_timings',
    'organizers',
    'teams',
    'schedules',
    'live_timings',
    'tech_updates',
    'static_schedule',
  ]
  try {
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
          for (let i = 0; i < dataArr.length; i++) {
            let inEvent = JSON.parse(JSON.stringify(dataArr[i]))
            let teams = toArray(inEvent.teams),
              schedules = toArray(inEvent.schedules),
              live_timings = toArray(inEvent.live_timings),
              tech_updates = toArray(inEvent.tech_updates),
              static_schedule = toArray(inEvent.static_schedule),
              show_block = inEvent.show_block
            let updateEvent = {
              name: inEvent.name,
              venue: inEvent.venue,
              link: inEvent.link,
              start_date: inEvent.start_date,
              end_date: inEvent.end_date,
              event_short: inEvent.event_short,
              past: toBoolean(inEvent.past),
              show_block: {
                official_website: toBoolean(show_block.official_website),
                teams: toBoolean(show_block.teams),
                live_announcements: toBoolean(show_block.live_announcements),
                rules: toBoolean(show_block.rules),
                schedule: toBoolean(show_block.schedule),
                tech_inspection: toBoolean(show_block.tech_inspection),
                live_timings: toBoolean(show_block.live_timings)
              },
              teams,
              schedules,
              live_timings,
              tech_updates,
              static_schedule,
            }
            let updatedEvent = await Event.findOneAndUpdate({ _id: inEvent._id }, updateEvent, { new: true })
            if (updatedEvent) {
              console.log("Updated event");
              await Team.updateMany({ _id: { $in: teams } }, { $addToSet: { events: [updatedEvent._id] } })
            }
          }
          return Response.success(res, { message: "Updated event.", event: updatedEvent })
        }
      }
    }
    return Response.failed(res, { message: "Not found." })
  } catch (error) {
    console.log(error);
    return Response.failed(res, { message: "Some internal error." })
  }
}

const getOneSchedule = async (req, res) => {
  try {
    let id = req.params.id,
      $or = [{ event_short: id }]
    if (parseInt(id) == id) {
      $or.push({ _id: id })
    }
    let event = await Event.findOne({ $or: $or }).exec()
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
const getOneLivetiming = async (req, res) => {
  try {
    let id = req.params.id,
      $or = [{ event_short: id }]
    if (parseInt(id) == id) {
      $or.push({ _id: id })
    }
    let event = await Event.findOne({ $or: $or }).exec()
    if (event.length > 0) {
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
const getOneStaticScheduleEventTeam = async (req, res) => {
  try {
    let event = await Event.findOne({ _id: req.params.id })
    let team = await Team.findOne({ _id: req.params.team_id })
    if (event && team) {
      let static_schedule = await StaticSchedule.findOne({ event: event._id, team: team._id })
      if (static_schedule) {
        return Response.success(res, { static_schedule })
      }
    }
    return Response.failed(res, { message: "Not found." })
  } catch (error) {
    console.log(error);
    return Response.failed(res, { message: "Internal server error." })
  }
}
const getAllStaticSchedulesForEvent = async (req, res) => {
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
const getAllStaticSchedulesForTeam = async (req, res) => {
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
const getOneStaticSchedule = async (req, res) => {
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
const createEvent = async (req, res) => {
  try {
    let body = req.body, newEvent, organizers, edited = []
    if (body.event_organizers) {
      organizers = body.event_organizers.split(",")
      organizers.forEach(organizer => {
        edited.push(mongoose.Types.ObjectId(organizer))
      })
    }
    newEvent = new Event({
      name: body.event_name,
      venue: body.event_venue,
      organizer: edited,
      link: body.event_link,
      start_date: body.start_date,
      end_date: body.end_date
    })
    let saved = await newEvent.save()
    if (saved) {
      return Response.success(res, { message: "Created a event!" }, 200)
    }
    return Response.failed(res, { message: "failed to create an event" }, 300)
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
const addTeam = async (req, res) => {
  let event_id = req.params.id
  try {
    let team_id = req.body.team_id
    let team = await Team.findOne({ _id: team_id })
    if (team) {
      let event = await Event.findOne({ _id: event_id })
      if (event) {
        if (event.teams.indexOf(team_id) > -1) {
          return Response.success(res, {
            message: "Team already registered for event."
          })
        } else {
          let output = await event.updateOne({ $push: { teams: team_id } }, { new: true })
          if (output.nModified >= 1 && output.ok == 1) {
            return Response.success(res, {
              message: "Team registered."
            })
          }
        }
      }
      return Response.failed(res, { message: "Couldn't update event." })
    }
    return Response.failed(res, {
      message: "No such team in records."
    })
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
}
const updateEvent = async (req, res) => {
  try {
    let id = req.params.id, event
    console.log(req.body)
    event = await Event.findOneAndUpdate({ _id: id }, req.body, { new: true })
    if (!event) {
      return Response.success(res, { message: "No event found." })
    }
    return Response.success(res, {
      message: "Event updated.",
      event: event
    })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
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
const updateStaticSchedule = async (req, res) => {
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
const deleteEvent = async (req, res) => {
  try {
    let id = req.params.id,
      event = await Event.findOneAndDelete({ _id: id })
    if (!event) {
      return Response.success(res, {
        message: "Couldn't delete event."
      })
    }
    return Response.success(res, {
      deleted_event: event
    })
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
const deleteStaticSchedule = async (req, res) => {
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
const unlinkTeamFromEvent = async (req, res) => {
  let team, event, team_id, event_id, deleted = false
  try {
    team = await Team.findOne({ _id: team_id })
    event = await Event.findOne({ _id: event_id })
    if (team && event) {
      let out1 = await team.updateOne({ $pull: { events: event._id } })
      let out2 = await event.updateOne({ $pull: { teams: team._id } })
      if (out1.nModified >= 1 && out1.ok == 1 && out2.nModified >= 1 && out2.ok == 1) {
        return Response.success(res, { message: "Unlinked team and event." })
      }
      return Response.failed(res, { message: "Couldn't unlink team and event." })
    }
    return Response.failed(res, { message: "Not found." })
  } catch (error) {
    console.log(error)
    return Response.failed(res, { message: "Internal server error." })
  }
}
const unlinkTeamAndEvent = async (req, res) => {
  try {
    let team, team_id = req.params.id, event, event_id = req.params.event_id
    team = await Team.findOne({ _id: team_id })
    event = await Event.findOne({ _id: event_id })
    if (team && event) {
      // Check if they are linked
      if (team.events.contains(event._id)) {
        let out1 = await team.updateOne({ $pull: { "events": event._id } })
      }
      if (event.teams.contains(team._id)) {
        let out2 = await event.updateOne({ $pull: { "teams": team._id } })
      }
      if (out1.ok && out2.ok && (out1.nModified >= 0 || out2.nModified >= 0)) {
        return Response.success(res, { message: "Team and event unlinked." })
      }
    }
    return Response.failed(res, { message: "Couldn't remove." }, 404)
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
}

module.exports = {
  getAllEvents,
  getCurrentEvents,
  getOneEvent,
  getOneEventByName,
  getTeamForEvent,
  getTeamsCSVForEvent,
  getAllEventsByCSV,
  getCarsCSV,
  getAllCars,
  getSpecialEvent,
  // getAnnouncementsForEvent,
  // getOneAnnouncement,
  // getOneTechupdate,
  // getOneSchedule,
  // getOneLivetiming,
  // getOneStaticSchedule,
  // getAllTechupdates,
  // getAllSchedules,
  // getAllLivetimings,
  // getAllCars,
  // getAllStaticSchedulesForEvent,
  // getAllStaticSchedulesForTeam,
  // getOneStaticScheduleEventTeam,
  // getTeamCar,
  createEvent,
  updateEventFromCSV,
  updateEventsFromCSV,
  updateCarsFromCSV,
  // createAnnouncement,
  // createCar,
  // createLivetiming,
  // createTechupdate,
  // createSchedule,
  // createStaticSchedule,
  // addTeam,
  updateEvent,
  // updateAnnouncement,
  // updateLiveTiming,
  // updateTechUpdate,
  // updateSchedule,
  // updateStaticSchedule,
  // updateCar,
  deleteEvent,
  // deleteAnnouncement,
  // deleteLiveTiming,
  // deleteSchedule,
  // deleteTechUpdate,
  // deleteStaticSchedule,
  // unlinkTeamFromEvent,
}
