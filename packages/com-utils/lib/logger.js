const chalk = require('chalk')

function logger(args, chalkFn) {
    const logArgs = args.map(arg => {
        if (typeof arg === 'string') {
            arg = chalkFn(arg)
        }
        return arg
    })
    console.log(...logArgs)
}

function log(...args) {
    console.log(...args)
}

log.success = function (...args) {
    return logger(args, chalk.green)
}

log.error = function (...args) {
    return logger(args, chalk.red)
}

log.info = function (...args) {
    return logger(args, chalk.blue)
}

module.exports = log
