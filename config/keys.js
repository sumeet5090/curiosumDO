let prod = require('./prod.keys');
let dev = require('./dev.keys');

module.exports = (process.env.NODE_ENV === 'production') ? prod : dev
module.exports.isDev = function isDev() {
    return !(process.env.NODE_ENV === 'production')
}