const router = require('express').Router()
const helper = require('../../auth/helper')
const staticschedules = require('../../controllers/static-schedule.js')

router.get('/:id/', staticschedules.getAll)
router.get('/:id/:st_id', staticschedules.getOne)
router.get('/:id/:team_id', staticschedules.getOneForEventTeam)
router.post('/:id/:team_id', helper.allowStaff, staticschedules.create)
router.put('/:id/:st_id', helper.allowStaff, staticschedules.update)
router.delete('/:id/:st_id', helper.allowStaff, staticschedules.remove)

module.exports = router;