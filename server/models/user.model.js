// const bcrypt = require('bcryptjs')
// const mongoose = require('mongoose')
// const jwt = require('jsonwebtoken')
// const validate = require('mongoose-validator')
// const randomColor = require('randomcolor')
// const CONFIG = require('./../../config/keys')
// let Schema = mongoose.Schema;
// let UserSchema = Schema({
//   username: {
//     type: String,
//     unique: true,
//     index: true,
//     sparse: true,
//     lowercase: true
//   },
//   color: {
//     type: String,
//     default: randomColor()
//   },
//   phone_number: {
//     type: String,
//     lowercase: true,
//     trim: true,
//     select: false,
//   },
//   first_name: {
//     type: String,
//     trim: true
//   },
//   last_name: {
//     type: String,
//     trim: true
//   },
//   role: [{
//     type: String,
//     enum: ['admin', 'staff', 'volunteer', 'participant', 'alumni'],
//   }],
//   secondary_role: [{
//     type: String,
//     enum: ['design-judge', 'cost-judge', 'business-judge', 'inspector-mech', 'inspector-elec', 'ground-vol', 'track'],
//     default: function(){
//       if(role.indexOf('volunteer') > -1){
//         return 'ground-vol'
//       }
//     }
//   }],
//   google_id: String,
//   profile: {
//     picture: String,
//     location: String,
//     display_name: String,
//     gender: String
//   },
//   provider: String,
//   verified: Boolean,
//   display_name: {
//     type: String,
//   },
//   email: {
//     type: String,
//     lowercase: true,
//     trim: true,
//     index: true,
//     unique: true,
//     sparse: true,
//     validate: [validate({
//       validator: 'isEmail',
//       message: 'Invalid Email'
//     })]
//   },
//   google_plus_url: String,
//   bio: String,
//   // team: {
//   //   type: Schema.Types.ObjectId,
//   //   ref: 'Team'
//   // },
//   socialLinks: {
//     google: String,
//     facebook: String
//   },
//   status: {
//     type: Number,
//     default: 1,
//     // Anything other than 1 is deactivated/deleted
//   },
//   notifications:[{
//     text: String,
//     team_invite: {
//       type: Schema.Types.ObjectId,
//       ref: 'Team'
//     },
//     link: {
//       type: String,
//     },
//     confirmed: {
//       type: Boolean,
//       default: false
//     },
//   }]
// }, {
//     timestamps: true
//   })

// function strip(str) {
//   return str.replace(/^\s+|\s+$/g, '');
// }

// async function isUnique(username){
//   try {
//     let notUnique = await mongoose.models['User'].findOne({username: username})
//     if(notUnique){
//       return false
//     } else {
//       return true
//     }
//   } catch(error){
//     console.log(error)
//     setTimeout(isUnique(username), 500)
//   }
// }
// function generateRandomUsername(firstname, lastname){
//   firstname = firstname.split(' ')[0]
//   lastname = lastname.split(' ')[0]
//   lastname = lastname.split('.')[0]
//   return firstname + '-' + lastname + '-' + (Math.round(Math.random() * 9999)).toString()
// }

// UserSchema.pre('save', function (next) {
//   var user = this;
//   if (user.isModified('first_name') || user.isModified('last_name')) {
//     user.first_name = strip(user.first_name)
//     user.last_name = strip(user.last_name)
//     if (!user.last_name){
//       user.display_name = user.first_name
//     } else {
//       user.display_name = user.first_name + ' ' + user.last_name
//     }
//     try {
//       let username
//       while (true) {
//         username = generateRandomUsername(user.first_name, user.last_name)
//         if(isUnique(username)){
//           user.username = username
//           break
//         }
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   }
//   return next()
// })
// UserSchema.methods.comparePassword = function (password) {
//   let user = this
//   try {
//     return bcrypt.compareSync(password, user.password)
//   } catch (error) {
//     return false;
//   }
// }
// UserSchema.methods.getJWT = function () {
//   return "Bearer " + jwt.sign({
//     user_id: this._id,
//   }, CONFIG.jwt.secret, {
//       expiresIn: CONFIG.jwt.expiration
//     })
// }
// UserSchema.methods.toWeb = function () {
//   let json = this.toJSON()
//   json.id = this._id
//   return json
// }

// module.exports = mongoose.model('User', UserSchema)



const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const validate = require('mongoose-validator')
const randomColor = require('randomcolor')
const CONFIG = require('./../../config/keys')
let Schema = mongoose.Schema;
let UserSchema = Schema({
  username: {
    type: String,
    unique: true,
    index: true,
    sparse: true,
    lowercase: true
  },
  color: {
    type: String,
    default: randomColor()
  },
  phone_number: {
    type: String,
    lowercase: true,
    trim: true,
    // select: false,
  },
  phone_parts: {
    code: String,
    number: String
  },
  first_name: {
    type: String,
    trim: true
  },
  last_name: {
    type: String,
    trim: true
  },
  role: [{
    type: String,
    enum: ['admin', 'staff', 'volunteer', 'participant', 'alumni'],
  }],
  secondary_role: [{
    type: String,
    enum: ['design-judge', 'cost-judge', 'business-judge', 'inspector-mech', 'inspector-elec', 'ground-vol', 'track'],
    default: function(){
      if(role.indexOf('volunteer') > -1){
        return 'ground-vol'
      }
    }
  }],
  google_id: String,
  profile: {
    picture: String,
    location: String,
    display_name: String,
    gender: String
  },
  provider: String,
  verified: Boolean,
  display_name: {
    type: String,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    index: true,
    unique: true,
    sparse: true,
    validate: [validate({
      validator: 'isEmail',
      message: 'Invalid Email'
    })]
  },
  google_plus_url: String,
  bio: String,
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  socialLinks: {
    google: String,
    facebook: String
  },
  status: {
    type: Number,
    default: 1,
    // Anything other than 1 is deactivated/deleted
  },
  notifications:[{
    text: String,
    team_invite: {
      type: Schema.Types.ObjectId,
      ref: 'Team'
    },
    link: {
      type: String,
    },
    confirmed: {
      type: Boolean,
      default: false
    },
  }],

  volunteerFields: {
    currentPosition: String,
    currentWorkplace: String,
    highestLvl: String,
    postalAddress: String,
    claimAlmusStatus: {
      type: Schema.Types.ObjectId,
      ref: 'Team'
    },
    positionInterestedIn: {
      type: String,
      enum: ['Ground Volunteer', 'Event Control', 'Registration', 'Junior Tech - Combustion', 'Junior Tech - Electric', 'Junior Tech - Electric', 'Junior Tech - Hot Pits', 'Design Judge', 'Business Judge', 'Cost Judge', 'Dynamics - Track & Timing'],
    }
  },

  // new fields
  infoSubmited: Boolean,
  userType: {
    type: String,
    enum: ['Student', 'Faculty'],
  },
  roleOnTeam: {
    type: String,
  },
  yearOfStudy: {
    type: String,
  },
  programOFStudy: {
    type: String,
  },
  eventOfParticipation: {
    type: Number,
    ref: 'Event'
  },
  eventParticipated: [{
    type: Number,
    ref: 'Event'
  }],
  formulaBharatDetails: {
    fullName: String,
    age: {
      value: Number,
      file: String
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    dietaryInformation: {
      type: String,
      enum: ['Vegetarian', 'Non-Vegetarian'],
    },
    emergencyContactDetails: {
      contactName: String,
      contactPhoneNumber: String,
      phone_parts: {
        code: String,
        number: String
      },
    },
    medicalInsurance: {
      name: String,
      number: String,
      file: String,
    },
    ifDesignatedDriver: {
      answer: Boolean,
      file: String
    },
    individualAgree: String
  }



}, {
    timestamps: true
  })

function strip(str) {
  return str.replace(/^\s+|\s+$/g, '');
}
async function isUnique(username){
  try {
    let notUnique = await mongoose.models['User'].findOne({username: username})
    if(notUnique){
      return false
    } else {
      return true
    }
  } catch(error){
    console.log(error)
    setTimeout(isUnique(username), 500)
  }
}
function generateRandomUsername(firstname, lastname){
  firstname = firstname.split(' ')[0]
  lastname = lastname.split(' ')[0]
  lastname = lastname.split('.')[0]
  return firstname + '-' + lastname + '-' + (Math.round(Math.random() * 9999)).toString()
}

UserSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('first_name') || user.isModified('last_name')) {
    user.first_name = strip(user.first_name)
    user.last_name = strip(user.last_name)
    if (!user.last_name){
      user.display_name = user.first_name
    } else {
      user.display_name = user.first_name + ' ' + user.last_name
    }
    try {
      let username
      while (true) {
        username = generateRandomUsername(user.first_name, user.last_name)
        if(isUnique(username)){
          user.username = username
          break
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  return next()
})
UserSchema.methods.comparePassword = function (password) {
  let user = this
  try {
    return bcrypt.compareSync(password, user.password)
  } catch (error) {
    return false;
  }
}
UserSchema.methods.getJWT = function () {
  return "Bearer " + jwt.sign({
    user_id: this._id,
  }, CONFIG.jwt.secret, {
      expiresIn: CONFIG.jwt.expiration
    })
}
UserSchema.methods.toWeb = function () {
  let json = this.toJSON()
  json.id = this._id
  return json
}

module.exports = mongoose.model('User', UserSchema)

