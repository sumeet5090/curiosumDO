const config = require('./../../nuxt.config.js')
const proto = require('./../prototypes/index')
const mongoose = require('mongoose')
const Section = require('./../models/forum/section.model')
const Event = require('./../models/event.model')
const Team = require('./../models/team.model')
const Car = require('./../models/car.model')
const Rule = require('./../models/forum/rule.model')
const SubRule = require('./../models/forum/sub-rule.model')
const database = require('./../database')
const db = database();



  if(1){
    Event.findOne({ $or: [{ _id: 6 }, { event_short: 'fb2021' }] }, (err, event) => {
      if (err) {
        console.log(err);
      }
      if (event) {
        console.log("Event FB2020 found");
        let eventCars = []
        for (let i = 0; i < data.length; i++) {
          let d = data[i]
          let newCar = new Car({
            car_number: d.car_number,
            category: d.category,
            event: event._id
          })
          newCar.save((err2, car) => {
            if (err2) {
              console.log(err2);
            }
            if (car) {
              console.log("Car :", car.car_number);
              eventCars.push(car._id)
              let newTeam = new Team({
                team_name: d.team_name,
                institution: {
                  name: d.institute_name,
                  short_name: d.institute_short,
                  address: d.institute_address,
                },
                team_captain_full_name: d.team_captain_full_name,
                team_captain_email: d.team_captain_email,
                website_url: d.website,
                users: [],
                country: d.country,
                social: {
                  facebook: d.social_facebook,
                  instagram: d.social_instagram,
                  twitter: d.social_twitter
                },
                cars: [car._id]
              })
              newTeam.save((errT, team) => {
                if (errT) {
                  console.log(errT);
                }
                if (team) {
                  console.log("Team created: ", team.team_name);
                  car.team = team._id
                  car.save((errS, saved) => {
                    if (errS) {
                      console.log(errS);
                    }
                    if (saved) {
                      console.log("Saved!", saved.team);
                    }
                  })


                  Event.findOneAndUpdate({_id: event._id}, { $addToSet: { cars: car._id, teams: team._id }}, (errU, eventUp) => {
                    if(errU){
                      console.log(errU);
                    }
                    if(eventUp){
                      console.log("Updated event", i);
                    }
                  })
                }
              })
            }
          })
        }
      }
    })

  }
