const shelljs = require('shelljs')
const { resolve } = require('../config/utils')

module.exports = function run() {
    shelljs.exec('npm link @touchds/com-cli')
    shelljs.exec(`node ${resolve('tools/dev-server')}`)
}
