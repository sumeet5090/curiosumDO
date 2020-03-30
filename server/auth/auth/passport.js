let passport = require('passport')
let User = require('./../models/user.model')

module.exports = function(app) {
    app.use(passport.initialize())
    app.use(passport.session())

    passport.serializeUser(function(user, done){
        return done(null, user._id)
    })

    passport.deserializeUser(async function(id, done){
        const user = await User.findOne({_id: id}).populate('volunteerFields.claimAlmusStatus');
        if(!user || user.status !== 1) {
          return done(null, false)
        }
        return done(null, user);
    });
    require('./strategies/google')(passport)
}
