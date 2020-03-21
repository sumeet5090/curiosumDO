
const express = require('express')
const fileUpload = require('express-fileupload')
const consola = require('consola')
require('./prototypes')
const { Nuxt, Builder } = require('nuxt')
// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
// Init Nuxt.js
const passportInitialize = require('./auth/passport')
const indexRouter = require('./routes')
const apiRouter = require('./routes/api')
const database = require('./database')
const session = require('./session')
const app = express()
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000
app.set('port', port)

async function start() {
  const nuxt = new Nuxt(config)
  // Build only in dev mode
  if (config.dev) {
    const builder = await new Builder(nuxt)
    await builder.build()
  }
  // Body parser
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())
  // Database
  let dbConn = database()
  // Session
  session(app, dbConn)
  // Passport
  passportInitialize(app)
  // File upload
  app.use(fileUpload())
  // Routes
  app.use('/', indexRouter)
  app.use('/api', apiRouter)


  // Give nuxt middleware to express
  app.use(nuxt.render)
  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
