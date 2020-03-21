let User = require('./../models/user.model');
let LocalStrategy = require('passport-local').Strategy;
let OAuthStrategy = require('passport-google-oauth').OAuth2Strategy;
let keys = require('./../../config/keys')

let localRegisterStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        let existingUser = await User.findOne({ email: email })
        if (!existingUser) {
            try {
                let newUser = await new User({
                    email: email,
                    password: password,
                    role: 'participant',
                }).save()
                if (!newUser) {
                    return done(null, false)
                }
                return done(null, newUser.toWeb())
            } catch (err) {
                return done(err, false)
            }
        }
        return done(null, existingUser.toWeb())
    } catch (error) {
        return done(error, false)
    }
})

let localLoginStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        let user = await User.findOne({ email: email })
        if (!user) {
            return done(null, false)
        }
        if (user.comparePassword(password)) {
            return done(null, user)
        } else {
            return done(null, false, { message: 'Incorrect combination' })
        }
    } catch (error) {
        return done(error, false)
    }
})

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser((id, done) => {
        User.findOne({ _id: id }, (err, user) => {
            if (err) {
                done(err, false)
            }
            if (!user) {
                done(null, false)
            }
            done(null, user)
        })
    })
    passport.use('local.register', localRegisterStrategy)
    passport.use('local.login'. localLoginStrategy)

}