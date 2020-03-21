const { Router } = require('express')
const router = Router();
const helper = require('./../../auth/helper')
const anncmtsCont = require('./../../controllers/announcement')
const carCont = require('./../../controllers/car')
const eventCont = require('./../../controllers/event')
const liveTimingCont = require('./../../controllers/live-timing')
const postCont = require('./../../controllers/posts')
const scheduleCont = require('./../../controllers/schedule')
const sectionController = require('./../../controllers/section')
const staticScheduleCont = require('./../../controllers/static-schedule')
const techUpdatesCont = require('./../../controllers/tech-update')
const reviewCont = require('./../../controllers/review')

// GET
router.get('/', eventCont.getAllEvents)
router.get('/csv', eventCont.getAllEventsByCSV)
router.get('/all/cars', eventCont.getAllCars)
router.get('/:id', eventCont.getOneEvent)
router.get('/:id/csv/cars', helper.allowStaff, eventCont.getCarsCSV)
router.get('/:id/teams', eventCont.getTeamForEvent)
router.get('/:id/teams/csv', helper.allowStaff, eventCont.getTeamsCSVForEvent)
// POST
router.post('/create', helper.allowStaff, eventCont.createEvent)
router.post('/csv', helper.allowStaff, eventCont.updateEventsFromCSV)
router.post('/:id/teams/csv', helper.allowStaff, eventCont.updateEventFromCSV)
router.post('/:id/csv/cars', helper.allowStaff, eventCont.updateCarsFromCSV)
// PUT
router.put('/:id', helper.allowStaff, eventCont.updateEvent)

// DELETE
router.delete('/:id', helper.allowStaff, eventCont.deleteEvent)

// Announcements
router.get('/:id/announcements/:annc_id', anncmtsCont.getOne)
router.get('/:id/announcements', anncmtsCont.getAll)
router.post('/:id/announcements', helper.allowStaff, anncmtsCont.create)
router.put('/:id/announcements/:annc_id', helper.allowStaff, anncmtsCont.update)
router.delete('/:id/announcements/:annc_id', helper.allowStaff, anncmtsCont.remove)

// Car
router.get('/:id/cars', carCont.getAll)
router.get('/:id/cars/:team_id/car', carCont.getForTeam)
router.post('/:id/cars/:team_id/car', helper.allowStaff, carCont.create)
router.put('/:id/cars/:team_id/car', helper.allowStaff, carCont.update)
router.delete('/:id/cars/:team_id/car', helper.allowStaff, carCont.remove)

// Forum
router.get('/:id/forum/posts', postCont.getAll)
router.get('/:id/forum/posts/:post_id', postCont.getOne)
router.get('/:id/forum/sections', sectionController.getAll)
router.post('/:id/forum/posts/create', helper.isAuthenticated, postCont.create)
router.put('/:id/forum/posts/:post_id', helper.isAuthenticated, postCont.update)
router.put('/:id/forum/posts/:post_id/admin', helper.isAdmin(), postCont.update)
router.put('/:id/forum/posts/:post_id/reply', helper.isAuthenticated, postCont.reply)
router.put('/:id/forum/posts/:post_id/reply/:reply_id', helper.isAuthenticated, postCont.replyEdit)
router.put('/:id/forum/posts/:post_id/reply/:reply_id/admin', helper.allowStaff, postCont.replyMark)
router.delete('/:id/forum/posts/:post_id', helper.isAuthenticated, postCont.remove)

// Live timings
router.get('/:id/live-timings/:lt_id', liveTimingCont.getOne)
router.get('/:id/live-timings', liveTimingCont.getAll)
router.post('/:id/live-timings/:team_id', helper.allowStaff, liveTimingCont.create)
router.put('/:id/live-timings/:lt_id', helper.allowStaff, liveTimingCont.update)
router.delete('/:id/live-timings/:lt_id', helper.allowStaff, liveTimingCont.remove)

//REVIEW
router.get('/:id/review:lt_id', reviewCont.getOne)
router.get('/:id/review', reviewCont.getAll)
router.post('/:id/review/:team_id', helper.allowStaff, reviewCont.create)
router.put('/:id/review/:lt_id', helper.allowStaff, reviewCont.update)
router.delete('/:id/review/:lt_id', helper.allowStaff, reviewCont.remove)


// Schedules
router.get('/:id/schedules/:sc_id', scheduleCont.getOneSchedule)
router.get('/:id/schedules', scheduleCont.getAllSchedules)
router.post('/:id/schedules', helper.allowStaff, scheduleCont.createSchedule)
router.put('/:id/schedules/:sc_id', helper.allowStaff, scheduleCont.updateSchedule)
router.delete('/:id/schedules/:sc_id', helper.allowStaff, scheduleCont.deleteSchedule)

// Static Schedules
router.get('/:id/static-schedules', staticScheduleCont.getAll)
router.get('/:id/static-schedules/:st_id', staticScheduleCont.getOne)
router.get('/:id/static-schedules/:team_id', staticScheduleCont.getOneForEventTeam)
router.post('/:id/static-schedules/:team_id', helper.allowStaff, staticScheduleCont.create)
router.put('/:id/static-schedules/:st_id', helper.allowStaff, staticScheduleCont.update)
router.delete('/:id/static-schedules/:st_id', helper.allowStaff, staticScheduleCont.remove)

// Technical Updates
router.get('/:id/tech-updates/:tu_id', techUpdatesCont.getOne)
router.get('/:id/tech-updates', techUpdatesCont.getAll)
router.post('/:id/tech-updates/:team_id', helper.allowStaff, techUpdatesCont.create)
router.put('/:id/tech-updates/:tu_id', helper.allowStaff, techUpdatesCont.update)
router.delete('/:id/tech-updates/:tu_id', helper.allowStaff, techUpdatesCont.remove)

module.exports = router;
