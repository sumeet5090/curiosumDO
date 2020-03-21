const { Router } = require('express')
const url = require('url')
const router = Router();
const TeamController = require('./../../controllers/team')
const helper = require('./../../auth/helper')
// GET
router.get('/', TeamController.getAll)
router.get('/csv', helper.allowStaff, TeamController.getTeamsCSV)
router.get('/:id', TeamController.getOne)
router.get('/:id/user', TeamController.getTeamExpandUser)
router.get('/:id/mini', TeamController.getOneMini)
router.get('/available/:name', TeamController.isAvailableByName)
router.get('/confirmation/:token', TeamController.confirmToken, (req, res) => {
  return res.redirect(url.format({
    pathname: '/info',
    query: res.locals
  }))
})
router.get('/:id/generate', helper.isCaptainOrAdmin(), TeamController.generateInviteLink)
router.get('/verify/:nnid', helper.isAuthenticated, TeamController.verifyInviteLink)
// POST
router.post('/create', helper.isAuthenticated, TeamController.create)
router.post('/:id/add/members', helper.isCaptainOrAdmin(), TeamController.addMembers)
router.post('/:id/add/alumnus', helper.isCaptainOrAdmin(), TeamController.addAlumnus)
router.post('/:id/remove/member/:user_id', helper.isCaptainOrAdmin(), TeamController.removeMembers)
router.post('/:id/remove/alumni/:user_id', helper.isCaptainOrAdmin(), TeamController.removeAlumnus)
router.post('/:id/register/event/:event_id', helper.isCaptainOrAdmin(), TeamController.linkTeamAndEvent)
router.post('/:id/register/user/:username', helper.isCaptainOrAdmin(), TeamController.linkTeamAndUser)
router.post('/:id/register/car/:car_id', helper.allowStaff, TeamController.linkTeamAndCar)
router.post('/:id/unlink/event/:event_id', helper.allowStaff, TeamController.unlinkTeamAndEvent)
router.post('/update/csv', helper.allowStaff, TeamController.updateTeamsFromCSV)
// PUT
router.put('/:id', helper.isCaptainOrAdmin(), TeamController.updateTeam)
router.put('/:id/captain', helper.isCaptainOrAdmin(), TeamController.changeCaptain)
// DELETE
router.delete('/:id', helper.isCaptainOrAdmin(), TeamController.deleteTeam)
router.delete('/:id/leave/:event_id', helper.allowStaff, TeamController.unlinkTeamFromEvent)

module.exports = router;
