const router = require('express').Router()
const helper = require('../../auth/helper')
const announcement = require('../../controllers/announcement')

router.get('/:id/:annc_id', announcement.getOne)
router.get('/:id/', announcement.getAll)
router.post('/:id/', helper.allowStaff, announcement.create)
router.put('/:id/:annc_id', helper.allowStaff, announcement.update)
router.delete('/:id/:annc_id', helper.allowStaff, announcement.remove)

module.exports = router;