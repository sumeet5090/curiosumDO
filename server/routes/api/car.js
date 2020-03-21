const router = require('express').Router()
const helper = require('../../auth/helper')
const car = require('../../controllers/car.js')

router.get('/:id/', car.getAll)
router.get('/:id/:team_id/car', car.getForTeam)
router.post('/:id/:team_id/car', helper.allowStaff, car.create)
router.put('/:id/:team_id/car', helper.allowStaff, car.update)
router.delete('/:id/:team_id/car', helper.allowStaff, car.remove)

module.exports = router;