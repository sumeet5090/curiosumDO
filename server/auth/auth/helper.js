const User = require('./../models/user.model')
const Team = require('./../models/team.model')

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.status(401).send('Unauthorized')
  }
}

const hasRole = (role) => {
  if (!role)
    throw new Error("Required role needs to be set")
  return function (req, res, next) {
    return isAuthenticated(req, res, () => {
      if (req.user && req.user.role) {
        if (req.user.role.contains(role)) {
          return next()
        }
      }
      return res.sendStatus(403)
    })
  }
}

const allowStaff = (req, res, next) => {
  return isAuthenticated(req, res, () => {
    if (req.user && req.user.role) {
      let role = req.user.role
      if (role.contains("admin") || role.contains("staff")) {
        return next()
      }
      console.log(role);
    }
    return res.sendStatus(403)
  })
}

const isAdmin = () => {
  return hasRole("admin")
}

const isParticipant = () => {
  return hasRole("participant")
}

const isVolunteer = () => {
  return hasRole("volunteer")
}

const isCaptainOrAdmin = (id = null) => {
  return async function (req, res, next) {
    if (req.user) {
      let user = req.user, team, captain
      if (req.params.id) {
        id = req.params.id
      }
      try {
        if (user.role.contains("admin")) {
          return next()
        }
        team = await Team.findOne({ _id: req.params.id })
        if (team) {
          if (team.captain.equals(user._id)) {
            return next()
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    return res.sendStatus(401)
  }
}

const linkTeamCaptain = async (user, done) => {
  try {
    let team = await Team.findOne({ team_captain_email: user.email })
    if (team) {
      user.team = team._id
      let saved = await user.save()
      team.captain = user._id
      team.team_captain_email = ''
      team.users.push(user._id)
      let team_saved = await team.save()
      if (team_saved && saved) {
        return done(null, user)
      }
    }
    return done(null, user)
  } catch (error) {
    return done(error, false)
  }
}

const linkSocialToAccount = async (opts) => {
  let req = opts.req,
    accessToken = opts.accessToken,
    refreshToken = opts.refreshToken,
    profile = opts.profile,
    done = opts.done,
    provider = opts.provider,
    email = opts.email,
    userData = opts.userData
  if (req.user) {
    let search = {}
    search[`socialLinks.${provider}`] = profile.id
    try {
      let exisitingUser = await User.findOne(search)
      if (exisitingUser) {
        if (exisitingUser._id != req.user._id) {
          return done(null, false)
        }
        return linkTeamCaptain(exisitingUser, done)
      }
      let user = await User.findOne({ _id: req.user._id })
      if (!user) {
        return done(null, false)
      }
      user.socialLinks = user.socialLinks || {}
      user.socialLinks[provider] = profile.id
      user.profile = user.profile || {}
      user.profile.picture = user.profile.picture || userData.picture
      user.profile.location = user.profile.location || userData.location
      await user.save()
      return linkTeamCaptain(user, done)
    } catch (error_out) {
      console.log('Error out' + error_out)
      return done(error_out, false)
    }
  }
  else {
    let search = {};
    search[`socialLinks.${provider}`] = profile.id
    try {
      let existingUser = await User.findOne(search)
      if (existingUser) {
        if (existingUser.status !== 1) {
          return done()
        }
        return linkTeamCaptain(existingUser, done)
      }
      if (!email) {
        return done(null, false, { message: "No email provided" })
      }
      try {
        let existingEmailUser = await User.findOne({ email: email })
        if (existingEmailUser) {
          if (existingEmailUser.status !== 1) {
            return done(null, false)
          }
          let user = existingEmailUser
          user.socialLinks = user.socialLinks || {}
          user.socialLinks[provider] = profile.id
          user.profile = user.profile || {}
          user.profile.picture = user.profile.picture || userData.picture
          user.profile.location = user.profile.location || userData.location
          let saved = await user.save()
          return linkTeamCaptain(saved, done)
        }
        let user = new User({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: email,
          verified: true,
          passwordLess: true,
          socialLinks: {
            google: profile.id
          },
          profile: userData,
          role: ["participant"]
        });
        let saved = await user.save()
        return linkTeamCaptain(saved, done)
      } catch (in_error) {
        console.log('in_error' + in_error)
        return done(in_error, false)
      }
    } catch (error) {
      console.log(error)
      return done(error, null)
    }
  }
}

module.exports = {
  isAuthenticated,
  allowStaff,
  hasRole,
  isParticipant,
  isVolunteer,
  isAdmin,
  isCaptainOrAdmin,
  linkSocialToAccount
}
