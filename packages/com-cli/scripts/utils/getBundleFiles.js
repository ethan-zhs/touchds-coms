const fs = require('fs-extra')
const path = require('path')
const { paths } = require('@touchds/com-utils/node')

function walkDir(dir) {
    const dirPath = paths.resolveApp(dir)
    const list = fs.readdirSync(dirPath)

    let fileList = []

    list.map(item => {
        const itemPath = path.join(dirPath + '/' + item)

        if (fs.statSync(itemPath).isDirectory()) {
            fileList = [fileList, ...walkDir(itemPath)]
        } else {
            fileList.push(itemPath)
        }
    })

    return fileList
}

function processFileInfo(output) {
    const fileList = walkDir(output)

    if (!fileList || !fileList.length) {
        return []
    }
    const res = fileList.map(item => {
        const data = {
            path: item,
            key: path.normalize(path.relative(paths.resolveApp(output), item)),
            stream: fs.createReadStream(item)
        }
        return data
    })
    return res
}

module.exports = function getBundleFiles(output) {
    const files = processFileInfo(output)

    return files
}
