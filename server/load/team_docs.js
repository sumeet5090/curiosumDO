require('dotenv').config().parsed
require('./../database')()
const Team = require('./../models/team.model')
const Event = require('./../models/event.model')
const docs = require('./../../data/team_docs')

const loadDocs = async () => {
  try {
    console.log('Docs count: '+docs.length)
    let count = 0
    for(let i=0; i<docs.length; i++){
      let team = await Team.findOneAndUpdate({team_name: docs[i].team_name}, {$push: {docs: docs[i].docs_url}})
      if(team){
        count++
      } else {
        console.log('Team not found: ', docs[i].team_name)
      }
    }
    console.log('Team entry count: '+count)
  } catch (error) {
    console.log(error)
    return;
  }
}

loadDocs()