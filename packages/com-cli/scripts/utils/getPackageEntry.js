const tar = require('tar-stream')
const through2 = require('through2')
const fs = require('fs-extra')
const { paths } = require('@touchds/com-utils/node')

const getPackage = require('./getPackage')
const bufferStream = require('./bufferStream.js')

function getPackagePath(name) {
    const dependence = fs.readJSONSync(paths.resolveApp('dependence.json')) || {}
    if (dependence[name] !== undefined) {
        return dependence[name]
    }
}

function getEntry(stream, limitEntryPath) {
    return new Promise((resolve, reject) => {
        const matchingEntries = {}
        const entryStream = through2.obj()

        let config = null
        let entryPath = null
        let isEntryStreamSetted = false

        const joinOut = thatStream => {
            if (isEntryStreamSetted) {
                throw new Error('joinOut isEntryStreamSetted = true')
            }
            isEntryStreamSetted = true
            entryStream.push(thatStream)
            entryStream.push(null)
        }

        const preserveStream = thatStream => {
            const read = through2()
            const out = through2()
            read.pipe(out)
            thatStream.on('data', buf => read.push(buf))
            thatStream.on('end', () => read.push(null))
            return out
        }

        stream
            .pipe(tar.extract())
            .on('error', reject)
            .on('entry', async (header, stream, next) => {
                stream.resume()

                if (isEntryStreamSetted) {
                    return stream
                        .on('end', () => {
                            next()
                        })
                        .resume()
                }

                const entry = {
                    path: header.name.replace(/^[^/]+\//g, ''),
                    type: header.type
                }

                if (entry.path === 'package.json') {
                    const content = await bufferStream(stream)
                    const packageJson = content.toString('utf-8')
                    config = JSON.parse(packageJson)

                    const findEntryPath = limitEntryPath || config.unpkg || config.main
                    const matchingEntry = matchingEntries[findEntryPath]

                    if (matchingEntry) {
                        entryPath = findEntryPath
                        joinOut(preserveStream(matchingEntry))
                    }
                    return next()
                }

                if (config) {
                    const findEntryPath = limitEntryPath || config.unpkg || config.main
                    if (entry.path === findEntryPath) {
                        entryPath = entry.path
                        joinOut(preserveStream(stream))
                        return next()
                    }
                    return next()
                }

                matchingEntries[entry.path] = preserveStream(stream)
                return next()
            })
            .on('error', error => entryStream.emit('error', error))
            .on('finish', () => {
                resolve({
                    path: entryPath,
                    stream: entryStream
                })
            })
    })
}

module.exports = async function getPackageEntry(name, version) {
    const stream = await getPackage(name, version)
    const limitEntryPath = getPackagePath(name)
    const entry = await getEntry(stream, limitEntryPath)

    return entry
}
