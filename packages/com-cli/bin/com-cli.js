#! /usr/bin/env node

const program = require('commander')
const version = require('../package').version

program.version(version).usage('<command> [options]')

program
    .command('list')
    .alias('ls')
    .description('查看组件模板')
    .action(() => {
        console.log('list')
    })

program
    .command('init')
    .description('初始化组件')
    .action((name, cmd) => {
        require('../scripts/init')(name, cmd)
    })

program
    .command('run')
    .description('运行组件')
    .action(() => {
        require('../scripts/run')()
    })

program
    .command('publish')
    .description('打包发布组件')
    .action(() => {
        require('../scripts/publish')()
    })

program.parse(process.argv)
