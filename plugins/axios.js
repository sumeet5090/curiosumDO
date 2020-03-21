import * as axios from 'axios'

let options = {
    baseURL: 'http://localhost:3000',
    browserBaseURL: '/',
    defaults:{
        headers: {
            post:{
                'Content-Type':'application/x-www-form-urlencoded'
            }
        }
    }
}
// The server-side needs a full url to works
if (process.server) {
  options.baseURL = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`
}

export default axios