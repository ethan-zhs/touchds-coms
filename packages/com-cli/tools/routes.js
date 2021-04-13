const Express = require('express')
const path = require('path')
const delay = require('delay')
const fs = require('fs-extra')
const log = require('fancy-log')
const { paths } = require('@touchds/com-utils/node')
const publish = require('../scripts/publish')

const router = Express.Router()

router
    .all('/*', function (req, res, next) {
        log(req.url)
        if (req.url.split('/')[1] == 'api') {
            next()
        } else {
            res.sendFile(path.join(__dirname, '../src/index.html'))
        }
    })

    .get('/api/com/package.json', function (req, res) {
        const comPackageJson = fs.readJSONSync(paths.resolve('package.json'))
        return res.status(200).send(comPackageJson)
    })

    .post('/api/com/save', async function (req, res) {
        try {
            const { config } = req.body || {}
            if (config && config.name) {
                fs.writeFileSync(paths.resolve('package.json'), JSON.stringify(config, null, 4))

                await delay(1000)
                return res.status(200).send({
                    code: 'success',
                    message: '配置保存成功',
                    data: config
                })
            }
        } catch (err) {
            return res.status(500).send(err)
        }
    })

// .post('/api/com/publish', async ctx => {
//     try {
//         await publish()
//         ctx.response.status = 200
//         ctx.body = {
//             code: 200,
//             message: 'success',
//             data: '组件发布成功'
//         }
//     } catch (err) {
//         ctx.response.status = 500
//         ctx.body = {
//             code: 500,
//             message: 'error',
//             data: err
//         }
//     }
// })

module.exports = router
