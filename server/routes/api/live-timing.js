const router = require('express').Router()
const helper = require('../../auth/helper')
const livetimings = require('../../controllers/live-timing')

router.get('/:id/:lt_id', livetimings.getOne)
router.get('/:id/', livetimings.getAll)
router.post('/:id/:team_id', helper.allowStaff, livetimings.create)
router.put('/:id/:lt_id', helper.allowStaff, livetimings.update)
router.delete('/:id/:lt_id', helper.allowStaff, livetimings.remove)

module.exports = router;
