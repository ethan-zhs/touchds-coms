const path = require('path')

exports.resolve = (...args) => path.join(__dirname, '..', ...args)
