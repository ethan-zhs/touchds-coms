const Koa = require('koa')
const cors = require('koa-cors')
const yargs = require('yargs')
const log = require('fancy-log')
const chalk = require('chalk')
const webpack = require('webpack')
const compress = require('koa-compress')
const e2k = require('express-to-koa')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('./webpack.config')
const router = require('./router')

const argv = yargs.alias('port', 'p').default('port', 1234).argv

const app = new Koa()
const compiler = webpack(config)

app.keys = ['com-field']

app.use(compress({ threshold: 0 }))
app.use(
    e2k(
        webpackDevMiddleware(compiler, {
            noInfo: true,
            publicPath: config.output.publicPath,
            hot: true,
            headers: { 'Access-Control-Allow-Origin': '*' }
        })
    )
)
app.use(e2k(webpackHotMiddleware(compiler)))

app.use(
    cors({
        origin: function (ctx) {
            if (ctx.url === '/test') {
                return false
            }
            return '*'
        },
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
        maxAge: 5,
        credentials: true,
        allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept']
    })
)

app.use(router.routes())

app.listen(argv.port)

log(chalk.green('API Server is running on: http://localhost:%s'), argv.port)
