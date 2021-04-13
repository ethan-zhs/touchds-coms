;['logger', 'paths'].forEach(m => {
    exports[m] = require(`./lib/${m}`)
})

exports.chalk = require('chalk')
exports.execa = require('execa')
exports.semver = require('semver')
