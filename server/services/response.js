const consola = require('consola')
const moment = require("moment")
module.exports = {
  success: function (res, data, code) {
    let send_data = { success: true }
    if (typeof data === 'object') send_data = Object.assign(send_data, data) // Merge objects
    let url, user_id, method = 'GET'
    if (res.req) {
      if (res.req.originalUrl) {
        url = res.req.originalUrl
      }
      user_id = res.req.ip
      if (res.req.user) {
        user_id = res.req.user._id
      }
      if (res.req.method) {
        method = res.req.method
      }
    }
    consola.success({
      message: `[${moment(Date.now()).format('LL LTS')}] [${method}] [${url}] [${user_id}]`,
      badge: true
    })
    return res.send(send_data)
  },
  failed: function (res, err, code) {
    if (typeof err === 'object' && typeof err.message !== 'undefined') err = err.message
    if (typeof code !== 'undefined') res.statusCode = code
    let url, user_id, method = 'GET'
    if (res.req) {
      if (res.req.originalUrl) {
        url = res.req.originalUrl
      }
      user_id = res.req.ip
      if (res.req.user) {
        user_id = res.req.user._id
      }
      if (res.req.method) {
        method = res.req.method
      }
    }
    consola.warn({
      message: `[${moment(Date.now()).format('LL LTS')}] [${method}] [${url}] [${user_id}]`,
      badge: true
    })
    return res.send({
      success: false,
      message: err
    })
  },
}
