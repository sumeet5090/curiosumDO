import gapi from 'gapi';
import axios from 'axios';
import googleConfig from './../config/google';

function handleClientLoad() {
  gapi.load('client:auth2', init);
}

function init() {
  gapi.client.init({
    scope: ['profile'],
    apiKey: googleConfig.google.clientSecret,
    clientId: googleConfig.google.clientID,
  }).then(() => {
    // Listen for sign in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus)
    // Handle the initial sign-in state
    updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn().get())
  })
}

function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    makeApiCall();
  }
}

function handleSignIn(event) {
  gapi.auth2.getAuthInstance().signIn()
}

function handleSignOut(event) {
  gapi.auth2.getAuthInstance().signOut()
}

function  makeApiCall(){
  gapi.client.people.people.get().then(function (response) {
    console.log(response.result)
  })
}