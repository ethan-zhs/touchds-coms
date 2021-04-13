const Router = require('koa-router')
const send = require('koa-send')
const log = require('fancy-log')

const router = new Router()

router
    .get('/dist/*', async ctx => (ctx.status = 404))
    .get('/md/*', async ctx => (ctx.status = 500))
    .get('/*', async ctx => {
        log(ctx.request.url)
        await send(ctx, 'src/view/index.html')
    })

module.exports = router
