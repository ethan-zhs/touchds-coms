const Express = require('express')
const webpack = require('webpack')
const log = require('fancy-log')
const cors = require('cors')
const bodyParse = require('body-parser')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const http = require('http')
const config = require('../config/webpack.config.js')
const routes = require('./routes')

const PORT = process.env.PORT || 9000

const app = Express()
const compiler = webpack(config)
const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    noInfo: true
})

const hotMiddleware = webpackHotMiddleware(compiler, {
    heartbeat: 5000
})
app.use(devMiddleware)
app.use(hotMiddleware)

app.use(cors())
app.use(bodyParse.json())

app.use(routes)

const httpServer = http.createServer(app)
httpServer.listen(PORT, function httpS() {
    log('HTTP Server is running on: http://localhost:%s', PORT)
})
