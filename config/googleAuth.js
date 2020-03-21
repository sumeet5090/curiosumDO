const googleAuth = require('google-auth-library')
const scope = "https://mail.google.com/"
const path = require('path')
const result = require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
let projectCredentials = {
  "web": {
    "client_id": process.env.GMAIL_CLIENT_ID,
    "project_id": process.env.GMAIL_PROJECT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": process.env.GMAIL_CLIENT_SECRET,
    "redirect_uris": [
      "https://developers.google.com/oauthplayground/",
      "http://localhost:3000"
    ],
    "javascript_origins": [
      "http://localhost:3000"
    ]
  }
}

let getAuthorizeUrl = function (callback) {
  if (typeof callback !== 'function') { throw new TypeError("Wrong argument type in google_auth.authorize(). Function expected, " + typeof callback + " recieved."); }

  var oauth2Client = new googleAuth.OAuth2Client(projectCredentials.web.client_id, projectCredentials.web.client_secret, projectCredentials.web.redirect_uris[1]);

  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scope
  });

  callback(null, authUrl);
}

// getAuthorizeUrl( (e, url) => {
//   if(e){
//     console.log(e);
//   }
//   if(url){
//     console.log(url);
//   }
// })

// One time code
let code = "4/aAE3cI_cAdd2B6aZ_UcJCIi003AGvdeXGrVTMqZfjgt-7YZwy5DzcgAgzynDvDXvIJ2vfrLvPr4YGgYXd8wgd0w"

let getAccessToken = function (callback) {
  var oauth2Client = new googleAuth.OAuth2Client(projectCredentials.web.client_id, projectCredentials.web.client_secret, projectCredentials.web.redirect_uris[1]);

  oauth2Client.getToken(code, function (err, token) {
    if (err) return console.log(err);

    callback(null, token);
  });
}

// getAccessToken((e, token) => {
//   if (e) {
//     console.log(e);
//   }
//   if (token) {
//     console.log(token);
//   }
// })

let tokens = {
  access_token: 'xxx',
  refresh_token: 'xxx',
  token_type: 'Bearer',
  expiry_date: 1560416694509
}