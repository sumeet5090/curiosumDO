let keys = {
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 27017,
        name: process.env.DB_NAME || 'mobility_eng_portal',
        options: {
            user: process.env.DB_USER || "",
			pass: process.env.DB_PASSWORD || "",
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            authSource: process.env.DB_AUTH_DATABASE
        }
    },
    google: {
        clientID: '861825259534-t3uvo3hh4qaambvqjvgn2v1mcj0ng54g.apps.googleusercontent.com',
        clientSecret: '5DFmQRlkBywW0v_LSaii1IDz'
    },
    bcrypt: {
        salt: 12
    },
    jwt: {
        secret: 'bdingbdingtingting',
        expiration: "7 days"
    },
    session: {
        secret: "HAHAHAHAHA SEssIoN SseCret!@? weQEQ",
        maxAge: 604800000
    }
}
keys.db.uri = `mongodb://${keys.db.host}:${keys.db.port}/${keys.db.name}?authSource=${keys.db.options.authSource}`

module.exports = keys
