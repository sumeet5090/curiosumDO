const { google } = require('googleapis')
const User = require('./../models/user.model')
const Event = require('./../models/event.model')
const Team = require('./../models/team.model')
const helper = require('./../auth/helper')
const Response = require('./../services/response')

const client_id = process.env.GOOGLE_GROUP_CLIENT_ID
const client_secret = process.env.GOOGLE_GROUP_CLIENT_SECRET

const auth = google.auth.OAuth2(client_id, client_secret)

const admin = google.admin({
  version: "directory_v1",
  auth
});

const getAllAdmins = async function (req, res) {
  try {
    let users = await User.find({ role: { $in: ['admin', 'staff'] } })
    if (users) {
      return Response.success(res, { users: users })
    }
    return Response.failed(res, { message: "No users found", users: [] })
  } catch (error) {
    console.log(error)
    return Response.failed(res, { message: "Internal Server Error" })
  }
}

const getAllVolunteers = async (req, res) => {
  try {
    let users = await User.find({ role: { $all: ['participant', 'volunteer'], $size: 2} });
    console.log(users);
    if (users) {
      return Response.success(res, { users: users })
    }
    return Response.failed(res, { message: "No users found", users: [] })
  } catch (error) {
    console.log(error)
    return Response.failed(res, { message: "Internal Server Error" })
  }
}

const getOnlyParticipants = async (req, res) => {
  try {
    let users = await User.find({ role: { $elemMatch: {$all:  ['participant']}, $size: 1 } })
    if (users) {
      return Response.success(res, { users: users })
    }
    return Response.failed(res, { message: "No users found", users: [] })
  } catch (error) {
    console.log(error)
    return Response.failed(res, { message: "Internal Server Error" })
  }
}

const getAll = async function (req, res) {
  try {
    let users = await User.find(), correctedUsers = [];
    if ((users.length > 0)) {
      users.forEach(user => {
        correctedUsers.push(user.toWeb())
      });
      return Response.success(res, { users: correctedUsers })
    }
    return Response.success(res, { message: "No users found." })
  } catch (error) {
    console.log(error)
    return Response.failed(res, { message: "Internal Server Error" })
  }
}

const getOne = async function (req, res) {
  try {
    let id = req.params.id;
    let user = await User.findOne({ _id: id }).populate('volunteerFields.claimAlmusStatus')
    if (!user) {
      return Response.success(res, { message: "No such user found." })
    }
    return Response.success(res, { user: user.toWeb() })
  } catch (error) {
    return Response.failed(res, { message: "Internal Server Error" })
  }
}

const getByUsername = async function (req, res) {
  try {
    let username = req.params.username;
    let user = await User.findOne({ username: username }).populate(['team','volunteerFields.claimAlmusStatus','eventParticipated']).exec();
    if (!user) {
      return Response.success(res, { message: "No such user found." })
    }
    return Response.success(res, { user: user.toWeb() })
  } catch (error) {
    return Response.failed(res, { message: "Internal Server Error" })
  }
}

const getOneByEmail = async function (req, res) {
  try {
    let user_email = req.params.email, user
    user = await User.findOne({ email: user_email })
    if (!user) {
      return res.send({
        success: false,
        user: {}
      })
    }
    return res.send({
      success: true,
      user: user
    })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

const getTeam = async function (req, res) {
  try {
    let id = req.params.id
    let user = await User.findOne({ _id: id }).populate('team').exec()
    if (!user) {
      return Response.failed(res, { message: "No such user found." })
    }
    if (!user.team) {
      return Response.failed(res, { message: "User has no team." });
    }
    return Response.success(res, { team: user.team })
  } catch (error) {
    return Response.failed(res, { message: "Internal Server Error" })
  }
}

const getTeamByUsername = async function (req, res) {
  try {
    let username = req.params.username
    let user = await User.findOne({ username: username }).populate('team').exec()
    if (!user) {
      return Response.failed(res, { message: "No such user found." })
    }
    if (!user.team) {
      return Response.failed(res, { message: "User has no team." })
    }
    return Response.success(res, { team: user.team })
  } catch (error) {
    return Response.failed(res, { message: "Internal Server Error" })
  }
}

const getNotifications = async function (req, res) {
  try {
    let user_id = req.params.id, user, notifications
    user = await User.findOne({ _id: user_id })
    if (user) {
      return res.send({
        success: true,
        notifications: user.notifications
      })
    }
    return res.send({
      success: false,
      message: 'User not found'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "Internal Server Error."
    })
  }
}

const inviteTeam = async function (req, res) {
  try {
    let user, notification, body = req.body, user_email = req.params.email
    user = await User.findOne({ email: user_email })
    if (user) {
      notification = {
        text: req.body.notification_text,
        team_invite: req.body.notification_link,
      }
      await user.updateOne({ $push: { notifications: notification } })
    }
  } catch (error) {

  }
}

const createBatchNotifications = async function (req, res) {

}

const addRole = async (req, res) => {
  try {
    let body = req.body, user, role = body.role, out
    user = await User.findOne({ email: body.user_email })
    if (user) {
      if (user.role.contains(role)) {
        return Response.failed(res, { message: "Role already set." }, 200)
      }
      out = await user.updateOne({ $push: { role: role } })
      if (out.nModified >= 1 && out.ok == 1) {
        return Response.success(res, { message: "Role " + role + " set" }, 200)
      }
    }
    return Response.failed(res, { message: "Role couldn't be set." }, 304)
  } catch (error) {
    console.log(error)
    return Response.failed(res, { message: "Internal Server Error" }, 500)
  }
}

const removeRole = async (req, res) => {
  try {
    let body = req.body, user, role = body.role, out
    user = await User.findOne({ email: body.user_email })
    if (user) {
      out = await user.updateOne({ $pull: { role: role } })
      if (out.nModified >= 1 && out.ok == 1) {
        return Response.success(res, { message: "Role " + role + " removed" }, 200)
      }
    }
    return Response.failed(res, { message: "User not found" }, 304)
  } catch (error) {
    console.log(error)
    return Response.failed(res, { message: "Internal server error." }, 500)
  }
}

const update = async function (req, res) {
  //  Put request
  let id = req.user._id;
  try {
    let user = await User.findOneAndUpdate({ _id: id }, req.body, { new: true });

    if(req.body.volunteerFields && req.body.volunteerFields.claimAlmusStatus) {
      const teamId = req.body.volunteerFields.claimAlmusStatus;
      const oldTeam = await Team.updateMany({
        alumnusCandidates: {
          $in: [id]
        }}, {
        $pull: {
          alumnusCandidates: id
        }});
      const team = await Team.findOneAndUpdate({
          _id: teamId,
          alumnusCandidates: {
            $nin: [id]
          }, alumnus: {
            $nin: [id]
          }}, {
          $push: {
            alumnusCandidates: id
      }});
    }
    if (!user) {
      return Response.failed(res, { message: "Couldn't update user." })
    }
   /* const details = req.body.details;
   if (details) {
     console.log(details);
     const userEvent = await  Event.findOneAndUpdate({ _id: user.eventOfParticipation }, {details});
     if (!userEvent) {
       return Response.success(res, { message: "Couldn't update event details." })
     }
   }*/

    return Response.success(res, { message: "Updated profile.", user })
  } catch (error) {
    console.log(error)
    return Response.failed(res, { message: "Internal Server Error" }, 500)
  }
}

const updateId = async function(req, res) {
  let id = req.params.id
  try {
    let user = await User.findOneAndUpdate({ _id: id }, req.body, { new: true })
    if (!user) {
      return Response.failed(res, { message: "Couldn't update user." })
    }
    return Response.success(res, { message: "Updated profile.", user })
  } catch (error) {
    return Response.failed(res, { message: "Internal Server Error" }, 500)
  }
}

const remove = async function (req, res) {
  let id = req.user._id
  try {
    let deletedUser = await User.findOneAndRemove({ _id: id })
    if (!deletedUser) {
      return res.send({
        message: "Couldn't Delete User."
      })
    }
    return res.send({
      message: "Deleted User",
      deletedUser
    })
  } catch (error) {
    return Response.failed(res, { message: "Internal Server Error" })
  }
}

module.exports = {
  getAll,
  getAllAdmins,
  getOnlyParticipants,
  getAllVolunteers,
  getOne,
  getOneByEmail,
  getByUsername,
  getTeam,
  getTeamByUsername,
  getNotifications,
  inviteTeam,
  createBatchNotifications,
  addRole,
  removeRole,
  update,
  updateId,
  remove,
};
