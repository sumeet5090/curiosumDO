const config = require('./../../nuxt.config.js')
const database = require('./../database')
const Event = require('./../models/event.model')
const Car = require('./../models/car.model')
const Team = require('./../models/team.model')
const proto = require('./../prototypes/index')
const mongoose = require('mongoose')
let db = database();
let data_fb_2017 = require('./../../data/fb_2017_teams');
let data_fb_2018 = require('./../../data/fb_2018_teams');
let data_fsev2018_jan = require('../../data/fsev2018_jan');
let data_fsev2018_oct = require('../../data/fsev2018_oct');

(async () => {
  try {
    let event = await Event.findOne({ name: "Formula Bharat 2017" })
    if (!event) {
      console.log("Couldn't find the event, creating . . .")
      event = await new Event({
        past: true,
        name: "Formula Bharat 2017",
        start_date: new Date('2017-01-26T05:30:00'),
        end_date: new Date('2017-01-29T05:30:00'),
        link: 'https://www.formulabharat.com/archive/'
      }).save()
    }
    let link_these_teams_to_event = []
    if (event.name == "Formula Bharat 2017") {
      console.log("Event ready!")
      console.log("data_fb_2017 length: ", data_fb_2017.length)
      for (let d = 0; d < data_fb_2017.length; d++) {
        let team = await Team.findOne({ team_name: data_fb_2017[d].team_name })
        if (team) {
          link_these_teams_to_event.push(team._id)
          let already_team_car = await new Car({
            event_id: event._id,
            team_id: team._id,
            car_number: data_fb_2017[d].car_number
          }).save()
          let saved_team = await team.update({ $addToSet: { events: event._id } }).exec()
          if (already_team_car && saved_team.nModified == 1) {
            console.log(`Car ${already_team_car.car_number} created for ${team.team_name}`)
          }
        } else {
          let new_team = await new Team({
            category: "combustion",
            team_name: data_fb_2017[d].team_name,
            institution: {
              name: data_fb_2017[d].institution_name,
            },
            events: [event._id],
            former_name: data_fb_2017[d].former_name
          }).save()
          if (new_team) {
            console.log(`${new_team.team_name} ready!`)
            link_these_teams_to_event.push(new_team._id)
            let new_car = await new Car({
              event_id: event._id,
              team_id: new_team._id,
              car_number: data_fb_2017[d].car_number
            }).save()
            if (new_car) {
              await new_team.update({car: new_car._id}).exec()
              console.log(`${new_car.car_number} created for ${new_team.team_name}`)
            }
          }
        }
      }
      let save_ev = await event.update({ $addToSet: { teams: link_these_teams_to_event } }).exec()
      if (save_ev) {
        console.log(`Event updated with ${link_these_teams_to_event.length} teams`)
      }
    }
  } catch (err) {
    console.log(err)
  }
})();


(async () => {
  try {
    let event = await Event.findOne({ name: "Formula Bharat 2018" })
    if (!event) {
      console.log("Couldn't find the event, creating . . .")
      event = await new Event({
        past: true,
        name: "Formula Bharat 2018",
        start_date: new Date('2018-01-26T05:30:00'),
        end_date: new Date('2018-01-29T05:30:00'),
        link: 'https://www.formulabharat.com/archive/'
      }).save()
    }
    let link_these_teams_to_event = []
    if (event.name == "Formula Bharat 2018") {
      console.log("Event ready!")
      console.log("data_fb_2018 length: ", data_fb_2018.length)
      for (let d = 0; d < data_fb_2018.length; d++) {
        let team = await Team.findOne({ team_name: data_fb_2018[d].team_name })
        if (team) {
          console.log("found: "+team.team_name)
          link_these_teams_to_event.push(team._id)
          let already_team_car = await new Car({
            event_id: event._id,
            team_id: team._id,
            car_number: data_fb_2018[d].car_number
          }).save()
          let saved_team = await team.update({ $addToSet: { events: event._id } }).exec()
          if (already_team_car && saved_team.nModified == 1) {
            console.log(`Car ${already_team_car.car_number} created for ${team.team_name}`)
          }
        } else {
          console.log("not found: "+data_fb_2018[d].team_name)
          let new_team = await new Team({
            category: data_fb_2018[d].category,
            team_name: data_fb_2018[d].team_name,
            institution: {
              name: data_fb_2018[d].institution_name,
            },
            events: [event._id],
            former_name: data_fb_2018[d].former_name
          }).save()
          if (new_team) {
            console.log(`${new_team.team_name} ready!`)
            link_these_teams_to_event.push(new_team._id)
            let new_car = await new Car({
              event_id: event._id,
              team_id: new_team._id,
              car_number: data_fb_2018[d].car_number
            }).save()
            if (new_car) {
              await new_team.update({car: new_car._id}).exec()
              console.log(`${new_car.car_number} created for ${new_team.team_name}`)
            }
          }
        }
      }
      let save_ev = await event.update({ $addToSet: { teams: link_these_teams_to_event } }).exec()
      if (save_ev) {
        console.log(`Event updated with ${link_these_teams_to_event.length} teams`)
      }
    }
  } catch (err) {
    console.log(err)
  }
})();

(async () => {
  try {
    let event = await Event.findOne({ name: "FSEV2018 January 2018" })
    if (!event) {
      console.log("Couldn't find the event, creating . . .")
      event = await new Event({
        past: true,
        name: "FSEV2018 January 2018",
        start_date: new Date('2018-01-26T05:30:00'),
        end_date: new Date('2018-01-29T05:30:00'),
        link: 'https://www.formulabharat.com/archive/'
      }).save()
    }
    let link_these_teams_to_event = []
    if (event.name == "FSEV2018 January 2018") {
      console.log("Event ready!")
      console.log("data_fsev2018_jan length: ", data_fsev2018_jan.length)
      for (let d = 0; d < data_fsev2018_jan.length; d++) {
        let team = await Team.findOne({ team_name: data_fsev2018_jan[d].team_name })
        if (team) {
          console.log("found: "+team.team_name)
          link_these_teams_to_event.push(team._id)
          let already_team_car = await new Car({
            event_id: event._id,
            team_id: team._id,
            car_number: data_fsev2018_jan[d].car_number
          }).save()
          let saved_team = await team.update({ $addToSet: { events: event._id } }).exec()
          if (already_team_car && saved_team.nModified == 1) {
            console.log(`Car ${already_team_car.car_number} created for ${team.team_name}`)
          }
        } else {
          console.log("not found: "+data_fsev2018_jan[d].team_name)
          let new_team = await new Team({
            category: data_fsev2018_jan[d].category,
            team_name: data_fsev2018_jan[d].team_name,
            institution: {
              name: data_fsev2018_jan[d].institution_name,
            },
            events: [event._id],
            former_name: data_fsev2018_jan[d].former_name
          }).save()
          if (new_team) {
            console.log(`${new_team.team_name} ready!`)
            link_these_teams_to_event.push(new_team._id)
            let new_car = await new Car({
              event_id: event._id,
              team_id: new_team._id,
              car_number: data_fsev2018_jan[d].car_number
            }).save()
            if (new_car) {
              await new_team.update({car: new_car._id}).exec()
              console.log(`${new_car.car_number} created for ${new_team.team_name}`)
            }
          }
        }
      }
      let save_ev = await event.update({ $addToSet: { teams: link_these_teams_to_event } }).exec()
      if (save_ev) {
        console.log(`Event updated with ${link_these_teams_to_event.length} teams`)
      }
    }
  } catch (err) {
    console.log(err)
  }
})();

(async () => {
  try {
    let event = await Event.findOne({ name: "FSEV2018 October 2018" })
    if (!event) {
      console.log("Couldn't find the event, creating . . .")
      event = await new Event({
        past: true,
        name: "FSEV2018 October 2018",
        start_date: new Date('2018-01-26T05:30:00'),
        end_date: new Date('2018-01-29T05:30:00'),
        link: 'https://www.formulabharat.com/archive/'
      }).save()
    }
    let link_these_teams_to_event = []
    if (event.name == "FSEV2018 October 2018") {
      console.log("Event ready!")
      console.log("data_fsev2018_oct length: ", data_fsev2018_oct.length)
      for (let d = 0; d < data_fsev2018_oct.length; d++) {
        let team = await Team.findOne({ team_name: data_fsev2018_oct[d].team_name })
        if (team) {
          console.log("found: "+team.team_name)
          link_these_teams_to_event.push(team._id)
          let already_team_car = await new Car({
            event_id: event._id,
            team_id: team._id,
            car_number: data_fsev2018_oct[d].car_number
          }).save()
          let saved_team = await team.update({ $addToSet: { events: event._id } }).exec()
          if (already_team_car && saved_team.nModified == 1) {
            console.log(`Car ${already_team_car.car_number} created for ${team.team_name}`)
          }
        } else {
          console.log("not found: "+data_fsev2018_oct[d].team_name)
          let new_team = await new Team({
            category: data_fsev2018_oct[d].category,
            team_name: data_fsev2018_oct[d].team_name,
            institution: {
              name: data_fsev2018_oct[d].institution_name,
            },
            events: [event._id],
            former_name: data_fsev2018_oct[d].former_name
          }).save()
          if (new_team) {
            console.log(`${new_team.team_name} ready!`)
            link_these_teams_to_event.push(new_team._id)
            let new_car = await new Car({
              event_id: event._id,
              team_id: new_team._id,
              car_number: data_fsev2018_oct[d].car_number
            }).save()
            if (new_car) {
              await new_team.update({car: new_car._id}).exec()
              console.log(`${new_car.car_number} created for ${new_team.team_name}`)
            }
          }
        }
      }
      let save_ev = await event.update({ $addToSet: { teams: link_these_teams_to_event } }).exec()
      if (save_ev) {
        console.log(`Event updated with ${link_these_teams_to_event.length} teams`)
      }
    }
  } catch (err) {
    console.log(err)
  }
})();