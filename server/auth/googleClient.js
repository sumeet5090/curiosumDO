const readline = require('readline')
const { google } = require('googleapis')
const SCOPES = ['https://www.googleapis.com/auth/admin.directory.user', 'https://www.googleapis.com/auth/admin.directory.group', 'https://www.googleapis.com/auth/admin.directory.group.readonly', 'https://www.googleapis.com/auth/admin.directory.group.member', 'https://www.googleapis.com/auth/admin.directory.group.member.readonly']
const fs = require('fs')
const TOKEN_PATH = 'token.json'
const credentials = require('./credentials')

authorize(credentials, listUsers)

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed
  const oauth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0])
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oauth2Client, callback)
    oauth2Client.credentials = JSON.parse(token)
    callback(oauth2Client)
  })
}

function getNewToken(oauth2Client, callback) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'online',
    scope: SCOPES,
  })
  console.log('Authorize this app by visiting this url:', authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close()
    oauth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err)
      oauth2Client.credentials = token
      storeToken(token)
      callback(oauth2Client)
    })
  })
}

function storeToken(token) {
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) return console.warn(`Token not stored to ${TOKEN_PATH}`, err)
    console.log(`Token stored to ${TOKEN_PATH}`)
  })
}

/**
 * Lists the first 10 users in the domain.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listUsers(auth) {
  const service = google.admin({ version: 'directory_v1', auth })
  service.users.list({
    customer: 'my_customer',
    maxResults: 10,
    orderBy: 'email',
  }, (err, res) => {
    if (err) return console.error('The API returned an error:', err.message)

    const users = res.data.users
    if (users.length) {
      console.log('Users:')
      users.forEach((user) => {
        console.log(`${user.primaryEmail} (${user.name.fullName})`)
      })
    } else {
      console.log('No users found.')
    }
  })
}
