const router = require('express').Router()
const helper = require('../../auth/helper')
const review = require('../../controllers/review')

router.get('/:id/:lt_id', review.getOne)
router.get('/:id/',  review.getAll)
router.post('/:id/:team_id', helper.allowStaff, review.create)
router.put('/:id/:lt_id', helper.allowStaff, review.update)
router.delete('/:id/:lt_id', helper.allowStaff, review.remove)

module.exports = router;
