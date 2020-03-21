const router = require('express').Router()

router.use('/posts', require('./posts'))
router.use('/sections', require('./rules'))

module.exports = router