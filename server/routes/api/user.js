const {Router} = require('express')
const router = Router();
const passport = require('passport')
const helper = require('./../../auth/helper')
const UserCont = require('./../../controllers/user')
// GET
router.get('/admins', helper.allowStaff, UserCont.getAllAdmins)
router.get('/volunteers', helper.allowStaff, UserCont.getAllVolunteers)
router.get('/participants', helper.allowStaff, UserCont.getOnlyParticipants)
router.get('/', UserCont.getAll) // Rewrite this !!!
router.get('/:id/team', UserCont.getTeam)
router.get('/:id', UserCont.getOne)
router.get('/email/:email', UserCont.getOneByEmail)
router.get('/profile/:username/team', UserCont.getTeamByUsername)
router.get('/profile/:username', UserCont.getByUsername)
router.get('/:id/notifications', UserCont.getNotifications)

// POST
router.post('/addrole', helper.isAdmin(), UserCont.addRole)
router.post('/removerole', helper.isAdmin(), UserCont.removeRole)

// router.post('/:id/:team_id/confirmation', UserCont.confirmToken)
// router.post('/:id/:team_id/resend', UserCont.resendToken)

// PUT
router.put('/:id/update', helper.isAuthenticated, UserCont.updateId)
router.put('/update', helper.isAuthenticated, UserCont.update)
//DELETE
module.exports = router;