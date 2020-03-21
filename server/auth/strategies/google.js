let Strategy1 = require('passport-google-oauth2').Strategy;
let helper = require('./../helper');
let keys = require('./../../../config/keys')
module.exports = (passport) => {
  let googleOAuth = new Strategy1({
    clientID: "861825259534-iiqh0g0ait0r6msm4o1sr7l684k9diqf.apps.googleusercontent.com",
    clientSecret: "kRb_I8bxOl_u1hVw6HNqHi6h",
    callbackURL: 'http://localhost:3000/auth/google/redirect',
    prompt: true,
    passReqToCallback: true,
    scope: ['email', 'profile', ]
  }, (req, accessToken, refreshToken, profile, done) => {
    helper.linkSocialToAccount({
      req,
      accessToken,
      refreshToken,
      profile,
      done,
      provider: "google",
      email: profile.emails[0].value,
      userData: {
        first_name: profile._json.name.givenName,
        last_name: profile._json.name.familyName,
        gender: profile.gender,
        picture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value.replace("sz=50", "sz=200") : null,
        location: profile.location || null
      }
    })
  })
  passport.use("google", googleOAuth)
}
