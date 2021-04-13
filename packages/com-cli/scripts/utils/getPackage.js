const url = require('url')
const https = require('https')
const gunzip = require('gunzip-maybe')

const npmRegistryURL = process.env.NPM_REGISTRY_URL || 'https://registry.npmjs.org'

const agent = new https.Agent({
    keepAlive: true
})

function get(options) {
    return new Promise((accept, reject) => {
        https.get(options, accept).on('error', reject)
    })
}

function isScopedPackageName(packageName) {
    return packageName.startsWith('@')
}

/**
 * Returns a stream of the tarball'd contents of the given package.
 */
module.exports = async function getPackage(packageName, version) {
    const tarballName = isScopedPackageName(packageName) ? packageName.split('/')[1] : packageName
    const tarballURL = `${npmRegistryURL}/${packageName}/-/${tarballName}-${version}.tgz`

    const { hostname, pathname } = url.parse(tarballURL)
    const options = {
        agent: agent,
        hostname: hostname,
        path: pathname
    }

    const res = await get(options)

    if (res.statusCode === 200) {
        const stream = res.pipe(gunzip())
        return stream
    }

    if (res.statusCode === 404) {
        return null
    }

    const content = (await bufferStream(res)).toString('utf-8')

    console.error('Error fetching tarball for %s@%s (status: %s)', packageName, version, res.statusCode)
    console.error(content)

    return null
}
