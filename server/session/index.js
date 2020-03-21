const session = require('express-session')
const mongoStore = require('connect-mongo')(session)
// const redisStore = require('connect-redis')(session)
const keys = require('./../../config/keys')
module.exports = function (app, mongooseConnection) {
    app.use(session({
        store: new mongoStore({
            mongooseConnection: mongooseConnection
        }),
        secret: keys.session.secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: parseInt(keys.session.maxAge)
        }
    }))
}