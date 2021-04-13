const crypto = require('crypto')
const mime = require('mime')
const is = require('is-type-of')
const dateFormat = require('dateformat')
const request = require('request')

const { OSS } = require('../../config/config')

function getResource(params) {
    let resource = '/'
    resource += OSS.bucket + OSS.key + '/'
    if (params.object) resource += params.object
    return resource
}

function signature(stringToSign) {
    let signature = crypto.createHmac('sha1', OSS.accessKeySecret)
    signature = signature.update(Buffer.from(stringToSign, 'utf8')).digest('base64')
    return signature
}

function authorization(method, resource, subres, headers) {
    let params = [
        method.toUpperCase(),
        headers['Content-Md5'] || '',
        headers['Content-Type'] || '',
        headers['x-oss-date']
    ]
    const ossHeaders = {}
    for (const key in headers) {
        const lkey = key.toLowerCase().trim()
        if (lkey.indexOf('x-oss-') === 0) {
            ossHeaders[lkey] = ossHeaders[lkey] || []
            ossHeaders[lkey].push(String(headers[key]).trim())
        }
    }
    const ossHeadersList = []
    Object.keys(ossHeaders)
        .sort()
        .forEach(function (key) {
            ossHeadersList.push(key + ':' + ossHeaders[key].join(','))
        })
    params = params.concat(ossHeadersList)
    let resourceStr = ''
    resourceStr += resource
    let subresList = []
    if (subres) {
        if (is.string(subres)) {
            subresList.push(subres)
        } else if (is.array(subres)) {
            subresList = subresList.concat(subres)
        } else {
            for (const k in subres) {
                const item = subres[k] ? k + '=' + subres[k] : k
                subresList.push(item)
            }
        }
    }
    if (subresList.length > 0) {
        resourceStr += '?' + subresList.join('&')
    }
    params.push(resourceStr)
    const stringToSign = params.join('\n')
    const auth = 'OSS ' + OSS.accessKeyId + ':'
    return auth + signature(stringToSign)
}

function getHeader(params) {
    const headers = {
        'x-oss-date': dateFormat(new Date().getTime(), "UTC:ddd, dd mmm yyyy HH:MM:ss 'GMT'")
    }
    headers['Content-Type'] = params.mime || 'application/x-www-form-urlencoded'
    if (params.content) {
        headers['Content-Md5'] = crypto.createHash('md5').update(Buffer.from(params.content, 'utf8')).digest('base64')
    }
    const authResource = getResource(params)
    headers.authorization = authorization(params.method, authResource, params.subres, headers)
    return headers
}

function getUrl(options) {
    let resourceStr = ''
    let subresList = []
    if (options.subres) {
        if (is.string(options.subres)) {
            subresList.push(options.subres)
        } else if (is.array(options.subres)) {
            subresList = subresList.concat(options.subres)
        } else {
            for (const k in options.subres) {
                const item = options.subres[k] ? k + '=' + options.subres[k] : k
                subresList.push(item)
            }
        }
    }
    if (subresList.length > 0) {
        resourceStr += '?' + subresList.join('&')
    }
    return OSS.dstUrl + OSS.key + '/' + options.object + resourceStr
}

module.exports = function uploadFile(fileInfo, OSSkey) {
    OSS.key = OSSkey
    const { key, path, stream } = fileInfo
    const ossData = {
        object: key.replace(/\\/g, '/'),
        method: 'PUT',
        steam: stream,
        mime: mime.getType(path)
    }
    const url = getUrl(ossData)
    const headers = getHeader(ossData)

    return new Promise((resolve, reject) => {
        stream.pipe(
            request(
                {
                    url,
                    method: ossData.method,
                    headers
                },
                function (err, res, body) {
                    if (err) {
                        console.log('\n' + path + ': error')
                        reject(err)
                    }
                    // console.log('\n' + path + ': ok')
                    resolve(url)
                }
            )
        )
    })
}
