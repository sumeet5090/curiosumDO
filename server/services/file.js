const fs = require('fs')

module.exports = {
  readFilesAsync: (path, opts = 'utf8') => {
    return new Promise((resolve, reject) => {
      fs.readFile(path, opts, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  },
  writeFilesAsync: (path, data, opts = 'utf8') => {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, opts, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }
}