const fs = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer')
const download = require('download-git-repo')
const validateNPMPackageName = require('validate-npm-package-name')
const { chalk, execa } = require('@touchds/com-utils/node')

const config = require('../config/config')
const gitlab = require('./utils/gitbeaker')

class Initialize {
    constructor(options) {
        // super()

        this.options = options
        this.context = options.cwd || process.cwd()
        this.targetTemplate = {}
    }

    // 创建初始化项目
    async init() {
        const gitlabGroups = await gitlab.getGroups()
        const reposList = await gitlab.getProjectsByGroupId(config.gitlab.templateGroupId)
        const targetGroup = gitlabGroups.find(item => item.id == config.gitlab.projectGroupId)

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: chalk.green('【请输入组件名称】: '),
                validate: async val => {
                    // 检测名称是否已经在gitlab上存在
                    const groupProjects = await gitlab.getProjectsByGroupId(targetGroup.id)
                    const isExistName = groupProjects.map(item => item.name).includes(val)

                    this.context = path.resolve(this.context, val)

                    if (!this.validateProjectName(val)) {
                        return '请输入合法的组件名称'
                    }

                    if (fs.existsSync(this.context)) {
                        return '您输入的组件名当前目录已存在'
                    }

                    if (isExistName) {
                        return '组件名称gitlab上已经存在'
                    }

                    return true
                }
            },
            {
                type: 'input',
                name: 'cnName',
                message: chalk.green('【请输入组件显示名】: '),
                validate: val => (val.trim() !== '' ? true : '请填写您的组件显示名称')
            },
            {
                type: 'input',
                name: 'description',
                message: chalk.green('【请输入组件描述】: '),
                validate: val => (val.trim() !== '' ? true : '请填写您的组件描述')
            },
            {
                type: 'list',
                name: 'template',
                message: chalk.green('【请选择组件模板类型】: '),
                choices: reposList.map(item => item.name)
            }
        ])

        // // 下载模板仓库代码
        const targetTemplate = reposList.find(item => item.name == answers.template)
        const tplRepos = targetTemplate.http_url_to_repo
        await this.downloadTemplate(`direct:${tplRepos}`, answers.name)

        // 创建gitlab仓库
        await gitlab.createProject({
            name: answers.name,
            namespace_id: targetGroup.id,
            description: answers.description,
            context: this.context
        })

        this.initPackageJson(answers)

        await this.installModules()

        console.log()
        console.log(`🎉 Successfully created components ${chalk.yellow(answers.name)}.`)
    }

    run(command, args) {
        if (!args) {
            ;[command, ...args] = command.split(/\s+/)
        }
        return execa(command, args, { cwd: this.context })
    }

    // 下载模板
    downloadTemplate(template, name) {
        return new Promise((resolve, reject) => {
            console.log()
            console.log(`🗃 模板下载中，请稍后...`)
            download(template, name, { clone: true }, function (err) {
                if (err) {
                    console.log(`🗃 模板下载失败`)
                    reject(err)
                    process.exit(1)
                } else {
                    console.log(`🎉 模板下载成功`)
                    resolve()
                }
            })
        })
    }

    validateProjectName(projectName) {
        // 检测名称是否符合npm包标准
        const result = validateNPMPackageName(projectName)
        return result.validForNewPackages
    }

    initPackageJson(answers = {}) {
        const { cnName, name, description } = answers
        const jsonPath = path.join(this.context, './package.json')
        const packageJson = fs.readJSONSync(jsonPath)

        if (packageJson) {
            packageJson.name = name
            packageJson.description = description
            packageJson.touchds && (packageJson.touchds.cnName = cnName)

            fs.writeFileSync(jsonPath, JSON.stringify(packageJson, null, 4))
        } else {
            console.error('Error: package.json with component not found')
            process.exit(0)
        }
    }

    async installModules() {
        console.log()
        console.log('🗃 正在安装一些依赖，请稍后...')
        try {
            await this.run('npm install')
            console.log('🎉 安装成功')
        } catch (err) {
            console.log('🗃 安装失败')
            console.log('err')
        }
    }
}

async function init(options) {
    console.clear()
    console.log(chalk.blue(` Touchds CLI v${require('../package').version}\n`))
    console.log('👉  work touchds init')

    const initialization = new Initialize(options)
    initialization.init()
}

module.exports = (...args) => {
    return init(...args).catch(err => {
        console.error(err)
    })
}
