const router = require('express').Router()
const Team = require('./../../models/team.model')
const path = require('path')
const crypto = require('crypto')
const fs = require('fs')
const rimraf = require('rimraf')
const JSON2CSV = require('json-2-csv')
const Response = require('./../../services/response')
const Types = require('mongoose').Types
const ObjectId = Types.ObjectId
router.use(require('express-fileupload')())
let DOWNLOADS_DIR = path.resolve('downloads/')
fs.readdir(DOWNLOADS_DIR, function (err, files) {
  if (err) {
    return console.log(err)
  }
  files.forEach((file, index) => {
    if (file !== '.gitignore') {
      fs.stat(path.join(DOWNLOADS_DIR, file), (erStat, stat) => {
        let endTime, now
        if (erStat) {
          return console.log(erStat);
        }
        now = new Date().getTime()
        endTime = new Date(stat.ctime).getTime() + 86400000
        if (now > endTime) {
          return rimraf(path.join(DOWNLOADS_DIR, file), (errRimRaf) => {
            if (errRimRaf) {
              return console.log(errRimRaf);
            }
            console.log("Deleted files older than 1 day.");
          })
        }
      })
    }
  })
})

router.get('/csv/event/:id/teams', (req, res, next) => {
  let teams = Team.find({}, (err, teams) => {
    if (err) {
      console.log(err);
      return res.send({
        message: "Internal server error"
      })
    }
    if (teams) {
      const fields = [
        '_id',
        'alumnus',
        'bio',
        'captain',
        'car',
        'category',
        'country',
        'drive_folder',
        'events',
        'institution.address',
        'institution.name',
        'institution.short_name',
        'live_timings',
        'location',
        'logo',
        'old_events',
        'past_event',
        'social.facebook',
        'social.instagram',
        'social.twitter',
        'static_schedules',
        'team_captain_email',
        'team_captain_full_name',
        'team_name',
        'tech_updates',
        'users',
        'website_url',
        'former_name'
      ]
      JSON2CSV.json2csv(JSON.parse(JSON.stringify(teams)), (err, csv) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: "Internal server error."
          })
        }
        if (csv) {
          let fname = 'downloads/team-' + crypto.randomBytes(8).toString('hex') + '.csv'
          let filename = path.resolve(fname)
          console.log(filename);
          fs.writeFileSync(fname, csv)
          res.locals.filename = fname
          res.sendFile(filename, {}, (err) => {
            if (err) {
              next(err);
            } else {
              console.log('Sent:', filename);
            }
          })
        }
      },
        {
          // delimiter: {
          //   field: ',',
          //   wrap: '"',
          //   eol: '\n'
          // },
          keys: fields,
          emptyFieldValue: '',
          expandArrayObjects: true
        })
    }
  })
}, (req, res) => {
  return res.send({
    success: false,
    message: "Some error occured."
  })
})

const toArray = (num) => {
  if (Array.isArray(num)) {
    return num
  }
  if (typeof num === 'number') {
    return [num]
  }
  if (typeof num === 'string' && num !== '') {
    return [num]
  }
}

// const toObjectId = ( val ) => {
//   let valLength = val.length - 1
//   if(val[0] == val[valLength]){
//     val = val.slice(1, -1)
//     console.log(val);
//   }
//   let x = ObjectId(val)
//   return x
// }
router.post('/event-team-csv', function (req, res) {
  let file = req.files.file
  if (file && file.data) {
    let csv = file.data.toString('utf8')
    const fields = [
      '_id',
      'team_name',
      'category',
      'captain',
      'alumnus',
      'bio',
      'car',
      'country',
      'drive_folder',
      'events',
      'institution.address',
      'institution.name',
      'institution.short_name',
      'live_timings',
      'location',
      'logo',
      'old_events',
      'past_event',
      'social.facebook',
      'social.instagram',
      'social.twitter',
      'static_schedules',
      'team_captain_email',
      'team_captain_full_name',
      'tech_updates',
      'users',
      'website_url',
      'former_name'
    ]
    JSON2CSV.csv2json(csv, (err, teams) => {
      if (err) {
        return console.log("JSON Err", err);
      }
      let updated = 0
      teams = JSON.parse(JSON.stringify(teams))
      teams.forEach((team, key) => {
        console.log(key);
        let new_team = {
          team_name: team.team_name,
          category: team.category,
          alumnus: toArray(team.alumnus),
          bio: team.bio,
          car: team.car,
          country: team.country,
          drive_folder: team.drive_folder,
          institution: team.institution,
          live_timings: toArray(team.live_timings),
          location: team.location,
          logo: team.logo,
          old_events: toArray(team.old_events),
          past_event: toArray(team.past_event),
          social: team.social,
          static_schedules: toArray(team.static_schedules),
          team_captain_email: team.team_captain_email,
          team_captain_full_name: team.team_captain_full_name,
          tech_updates: toArray(team.tech_updates),
          users: toArray(team.users),
          website_url: team.website_url,
          former_name: team.former_name
        }
        if (ObjectId.isValid(team.captain)) {
          new_team.captain = ObjectId(team.captain)
        }
        if (team.car != '') {
          new_team.car = team.car
        }

        Team.findOneAndUpdate({ _id: ObjectId(team._id) }, new_team, { upsert: true }, (errTeam, doc) => {
          if (errTeam) {
            return console.log("INSERT ERROR", errTeam)
          }
          if (doc) {
            return ++updated
          }
        })
      })
      if (updated > 0) {
        return Response.success(res, { message: updated + " teams updated." })
      }
    }, {
        keys: fields,
        emptyFieldValue: '',
        expandArrayObjects: true
      })
  }
  return Response.failed(res, { message: "Some error occured." })
})

module.exports = router