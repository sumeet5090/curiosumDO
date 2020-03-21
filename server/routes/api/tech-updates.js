const router = require('express').Router()
const helper = require('../../auth/helper')
const techupdates = require('../../controllers/tech-update')

router.get('/:id/:tu_id', techupdates.getOne)
router.get('/:id/', techupdates.getAll)
router.post('/:id/:team_id', helper.allowStaff, techupdates.create)
router.put('/:id/:tu_id', helper.allowStaff, techupdates.update)
router.delete('/:id/:tu_id', helper.allowStaff, techupdates.remove)

module.exports = router;
