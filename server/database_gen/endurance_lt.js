const config = require('./../../nuxt.config.js')
const database = require('./../database')
const Event = require('./../models/event.model')
const Schedule = require('./../models/schedule.model')
const LiveTiming = require('./../models/livetiming.model')
const Car = require('./../models/car.model')
const Team = require('./../models/team.model')
const proto = require('./../prototypes/index')
const mongoose = require('mongoose')

let db = database();

let data = require('./../../data/fb2019_endurance');

(async () => {
  try {
    let event = await Event.findOne({ _id: 1 })
    if (event) {
      let lt_og = await LiveTiming.find({event_name: "Endurance"})
      if(lt_og){
        let lt_arr = []
        lt_og.forEach( l => {
          lt_arr.push(l._id)
        })
        let rem_lt = await LiveTiming.deleteMany({_id: {$in: lt_arr}})
        if(rem_lt){
          console.log(rem_lt);
          console.log("Removed ", rem_lt.nRemoved);
        }
        lt_og.forEach( async lt => {
          event.live_timings.pull(lt._id)
        })
        let out = await event.save()
        console.log(out);
      }
      let entries = 0, failed = 0, count = 0, nc = 0, ltArray = []
      for (let i = 0; i < data.length; i++) {
        let car = await Car.findOne({ event_id: event._id, car_number: data[i].car_number })
        if (car) {
          let team = await Team.findOne({ _id: car.team_id })
          if (team) {
            let lt = await new LiveTiming({
              team_id: team._id,
              event_id: event._id,
              event_name: data[i].event_name,
              lap_number: data[i].lap_number,
              lap_time: data[i].lap_time,
              driver_initial: data[i].driver_initial
            }).save()
            if (lt) {
              ltArray.push(lt._id)
            }
          }
        } else {
        }
      }
      let out = await event.updateOne({ $push: { live_timings: ltArray } })
      if (out.nModified >= 1 && out.ok == 1) {
        console.log("Event updated.");
      }
    }
  } catch (error) {
    console.log(error);
  }
})()