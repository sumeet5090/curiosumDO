let passport = require('passport')
let User = require('./../models/user.model')

module.exports = function(app) {
    app.use(passport.initialize())
    app.use(passport.session())

    passport.serializeUser(function(user, done){
        return done(null, user._id)
    })

    passport.deserializeUser(function(id, done){
        User.findOne({_id: id}, (err, user) => {
            if(err)
                return done(err, false)
            if(!user || user.status !== 1)
                return done(null, false)
            return done(null, user)
        })        
    })
    require('./strategies/google')(passport)
}