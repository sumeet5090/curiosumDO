const router = require('express').Router()
const sectionController = require('../../../controllers/section')

router.get('/', sectionController.getAll)


module.exports = router
