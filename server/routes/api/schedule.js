const router = require('express').Router()
const helper = require('../../auth/helper')
const schedule = require('../../controllers/schedule')

router.get('/:id/:sc_id', schedule.getOneSchedule)
router.get('/:id/', schedule.getAllSchedules)
router.post('/:id/', helper.allowStaff, schedule.createSchedule)
router.put('/:id/:sc_id', helper.allowStaff, schedule.updateSchedule)
router.delete('/:id/:sc_id', helper.allowStaff, schedule.deleteSchedule)

module.exports = router;