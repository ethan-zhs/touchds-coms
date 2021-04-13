const path = require('path')
const fs = require('fs-extra')

const appDirectory = fs.realpathSync(process.cwd())
const resolve = relativePath => path.resolve(appDirectory, relativePath)

module.exports = {
    resolve
}
