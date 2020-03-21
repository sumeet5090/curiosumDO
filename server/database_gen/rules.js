const config = require('./../../nuxt.config.js')
const proto = require('./../prototypes/index')
const mongoose = require('mongoose')
const Section = require('./../models/forum/section.model')
const Event = require('./../models/event.model')
const Rule = require('./../models/forum/rule.model')
const SubRule = require('./../models/forum/sub-rule.model')
const database = require('./../database')
const db = database();
const data = require('./../../data/rules_forum');

if (1) {
  console.log("Started");
  Event.findOne({ $or: [{ _id: 6 }, { event_short: 'fb2020' }] }, (errE, event) => {
    if (errE) {
      console.log(errE);
    }
    if (event) {
      console.log("Found event");
      data.forEach(d => {
        let rules = []
        let section = new Section({
          name: d.name,
          notation: d.notation,
          event: event._id
        })
        d.rules.forEach(r => {
          let sub_rules = []
          let rule = new Rule({
            name: r.name,
            notation: r.notation,
            section: section._id
          })
          r.sub_rules.forEach(s => {
            let sub_rule = new SubRule({
              name: s.name,
              notation: s.notation,
              rule: rule._id
            })
            sub_rule.save((err, saved) => {
              if (err) {
                console.log(err);
              }
            })
            sub_rules.push(sub_rule._id)
          })
          console.log("Saved rules ", sub_rules.length);
          rule.sub_rules = sub_rules
          rule.save((err, saved) => {
            if (err) {
              console.log(err);
            }
          })
          rules.push(rule._id)
        })
        console.log("Saved rules ", rules.length);
        section.rules = rules
        section.save((err) => {
          if (err) {
            console.log(err);
          }
        })
      })
    }
  })

}
