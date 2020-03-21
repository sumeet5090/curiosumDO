require('dotenv').config().parsed
require('./../database')()
const Team = require('./../models/team.model')
const Event = require('./../models/event.model')
const teams = require('./../../data/mec_teams')

const loadTeams = async () => {
    try {
        let insertedTeams = await Team.insertMany(teams)
        if(insertedTeams && insertedTeams.length > 0) {
            console.log(`Inserted ${insertedTeams.length} teams`)
        } else {
            console.log("Failed to insert teams.")
        }
        let Xteams = []
        insertedTeams.forEach(team => {
           Xteams.push(team._id)
        });
        console.log("TEAM LENGTH: ", Xteams.length)
        let event = await Event.findOneAndUpdate({_id: insertedTeams[0].events[0]}, {$push: {teams: Xteams}}, {new: true})
        if(event){
            console.log(`Linked ${event.teams.length}`)
        }
    } catch (error) {
        console.log(error)
        return;
    }
}
loadTeams()