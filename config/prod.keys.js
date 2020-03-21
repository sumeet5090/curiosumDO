let keys = {
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 27017,
        name: process.env.DB_NAME || 'mobility_eng_portal',
        options: {
			user: process.env.DB_USER || "frozen",
			pass: process.env.DB_PASSWORD || "root",
            useNewUrlParser: true,
            authSource: process.env.DB_AUTH_DATABASE
		}
    },
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
    bcrypt: {
        salt: 12
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiration: process.JWT_EXPIRATION
    },
    session: {
        secret: process.env.SESSION_SECRET,
        maxAge: process.env.SESSION_MAX_AGE
    }
}

// mongodb://monguser:mongpass@192.168.2.2:27017/ps?authSource=admin
keys.db.uri = `mongodb://${keys.db.host}:${keys.db.port}/${keys.db.name}?authSource=${keys.db.options.authSource}`
module.exports = keys
