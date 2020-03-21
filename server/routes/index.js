const { Router } = require('express')
const passport = require('passport')
const router = Router()

router.get('/auth/google', passport.authenticate('google'))

router.get('/login', (req, res) => {
    if (req.user) {
        return res.redirect('/')
    } else {
        return res.redirect('/auth/google')
    }
})

router.get('/auth/google/redirect', passport.authenticate('google', { authInfo: true, successRedirect: '/', failureRedirect: '/login' }))

router.post('/api/logout', (req, res) => {
    req.logout();
    return res.redirect('/')
})

module.exports = router;