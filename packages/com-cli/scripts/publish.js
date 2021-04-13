const fs = require('fs-extra')
const ora = require('ora')
const through2 = require('through2')
const shelljs = require('shelljs')
const webpack = require('webpack')
const { logger: log, chalk, paths } = require('@touchds/com-utils/node')

const getPackageEntry = require('./utils/getPackageEntry')
const uploadFile = require('./utils/uploader')
const getBundleFiles = require('./utils/getBundleFiles')
const webpackConfig = require('../config/webpack.com.config')

const NPM_CDN_KEY = 'touchds/npm'
const COM_CDN_KEY = 'touchds/com'
const spinner = ora('loading')

async function unpkgModules(packages = {}) {
    log()
    log('- NPM依赖包发布CDN')

    spinner.text = '正在发布...'
    spinner.start()

    const keys = Object.getOwnPropertyNames(packages)

    return Promise.all(
        keys.map(async key => {
            const name = key
            const version = packages[key].replace('^', '')
            const entry = await getPackageEntry(name, version)

            entry.stream
                .pipe(
                    through2.obj(async (stream, _, next) => {
                        await uploadFile(
                            { stream, key: 'index.js', path: entry.path },
                            `${NPM_CDN_KEY}/${name}/${version}`
                        )
                        next(null)
                    })
                )
                .on('error', (...args) => {
                    spinner.fail(chalk.red('发布失败'))
                    reject(...args)
                })
                .on('finish', () => {
                    spinner.succeed(chalk.green('发布成功'))
                    log()
                })
        })
    )
}

async function runWebpackBuild() {
    const compiler = webpack(webpackConfig)

    log()
    log('- 组件打包构建')

    spinner.text = '正在打包...'
    spinner.start()

    return new Promise((resolve, reject) => {
        compiler.run((err, ...rest) => {
            if (err) {
                spinner.fail(chalk.red('构建失败'))
                log.error(err)
                reject(err)
            } else {
                spinner.succeed(chalk.green('构建成功'))
                resolve(rest)
            }
        })
    })
}

function getPackageJson() {
    const packageJson = fs.readJSONSync(paths.appPackageJson)
    if (packageJson) {
        return packageJson
    } else {
        console.error('Error: package.json with component not found')
        process.exit(0)
    }
}

async function publishCom(name, version) {
    shelljs.rm('-rf', paths.resolveApp('dist'))
    await runWebpackBuild()

    // 拷贝package.json 到打包好的目录
    shelljs.cp('-r', paths.appPackageJson, paths.resolveApp('dist'))

    // 获得组件打包后的文件
    // const files = getBundleFiles('dist')

    // log()
    // log('- 组件包发布CDN')

    // spinner.text = '正在发布...'
    // spinner.start()

    // return Promise.all(
    //     files.map(async item => {
    //         await uploadFile(item, `${COM_CDN_KEY}/${name}/${version}`)
    //     })
    // )
}

module.exports = async function publish() {
    const { name = '', version = '0.0.1', dependencies = {} } = getPackageJson()

    shelljs.exec('npm link @touchds/com-cli')

    console.clear()
    console.log(chalk.blue(` Touchds CLI v${require('../package').version}\n`))
    console.log('👉  work touchds publish')

    try {
        await publishCom(name, version)
        spinner.succeed(chalk.green('发布成功'))
    } catch (err) {
        spinner.fail(chalk.red('发布失败'))
        process.exit(0)
    }

    await unpkgModules(dependencies)
}
