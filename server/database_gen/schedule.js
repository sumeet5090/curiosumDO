const config = require('./../../nuxt.config.js')
const database = require('./../database')
const Event = require('./../models/event.model')
const Schedule = require('./../models/schedule.model')
const Car = require('./../models/car.model')
const Team = require('./../models/team.model')
const proto = require('./../prototypes/index')
const mongoose = require('mongoose')
let db = database();

let data = require('./../../data/fb_2019_schedule');

(async () => {
  try {
    let event = await Event.findOne({_id: 1})
    if(event) {
      let entries = 0, failed = 0
      for(let i=0; i<data.length; i++){
          console.log("Day ", data[i].day_number);
          let schedule = await new Schedule(Object.assign(data[i], {event_id: event._id})).save()
          if(schedule) {
            entries++
          } else {
            failed ++
          }
      }
      console.log("Entries: ", entries, "\nFailed: ", failed);
    }
  } catch (error) {
    console.log(error);
  }
})()