let LocalStrategy = require('passport-local').Strategy;
let User = require('./../../models/user.model')

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    }, async function (req, email, password, done) {
        try {
            let user = await User.findOne({ email: email })
            if (!user)
                return done(null, false, { message: "Unknown email" })
            if (user.status !== 1)
                return done(null, false, { message: "Account disabled / deleted" })
            let isMatch = user.comparePassword(password)
            if (!isMatch)
                return done(null, false, { message: "Invalid password" })
            else
                return done(null, user)

        } catch (err) {
            return done(err, false)
        }
    }))
}