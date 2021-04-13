const path = require('path')
const fs = require('fs-extra')
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)
const resolve = (...arg) => path.join(__dirname, '..', ...arg)

module.exports = {
    appIndexJs: resolveApp('src/index.js'),
    appUIJs: resolveApp('src/ui.js'),
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp('src'),
    resolve,
    resolveApp
}
