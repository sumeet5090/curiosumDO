import axios from 'axios'

let host = process.env.HOST || 'localhost'
let port = process.env.PORT || 3000
export default () => {
  return axios.create({
    baseURL: `http://${host}:${port}`
  })
}