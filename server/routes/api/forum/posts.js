const router = require('express').Router()
const posts = require('../../../controllers/posts')
const helper = require('./../../../auth/helper')
// GET
router.get('/:id/', posts.getAll)
router.get('/:id/:post_id', posts.getOne)

// POST
router.post('/create', helper.isAuthenticated, posts.create)

// PUT
router.put('/:id/:post_id', helper.isAuthenticated, posts.update)
router.put('/:id/:post_id/reply', helper.isAuthenticated, posts.reply)

// DELETE
router.delete('/:id/:post_id', helper.isAuthenticated, posts.remove)
router.delete('/:id/:post_id/restore', helper.isAuthenticated, posts.restore)

module.exports = router