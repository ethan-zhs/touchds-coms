/**
 *  时间延时
 *  @param {number} ms 单位: 毫秒
 */
function delay(ms: number) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms)
    })
}

/**
 *  Dom 加载到body
 *  @param {HTMLElement} element dom节点
 */
function appendSilentElementToBody(element: HTMLElement) {
    element.style.cssText = `
        position: fixed;
        top: -100;
        left: -100;
        width: 0;
        height: 0;
        opacity: 0
    `
    document.body.appendChild(element)
}

/**
 *  创建上传对象
 *  @param {string} ossType 上传云类型
 *  @param {object} token 上传token
 *  @param {object} toPosition 上传目录
 *  @param {object} options 上传配置
 */
export function createOssUploader(ossType: string, token: any, toPosition: any, options: any) {
    // 初始化上传容器和上传按钮Id
    const containerId = `upload_container_${Date.now()}_${Math.random()}`
    const buttonId = `upload_button_${Date.now()}_${Math.random()}`

    // 初始化上传容器和上传按钮Dom
    const containerElement: HTMLDivElement = document.createElement('div')
    const uploadButtonElement: HTMLSpanElement = document.createElement('span')

    // 设置上传容器和上传按钮Id
    containerElement.setAttribute('id', containerId)
    uploadButtonElement.setAttribute('id', buttonId)

    containerElement.appendChild(uploadButtonElement)

    // 将上传容器和上传按钮加到body
    appendSilentElementToBody(containerElement)

    const { accessKeyId, accessKeySecret, securityToken } = token

    const { bucketName, directory, sourcePoint } = toPosition

    const {
        types = [],
        uploadType = 'direct',
        multiple = false,
        maxSize = 5,
        handleExpire = () => void 0,
        fileAdded = (uploadList: any, uploader: any) => void 0,
        progress = (a: any, b: any) => void 0,
        error = (err: any) => void 0,
        complete = (res: any) => void 0,
        completeQueue = () => void 0
    } = options

    if (!Array.isArray(types) || types.length === 0) {
        // eslint-disable-next-line
        throw new TypeError(`types 参数必须传入数组, 如: ['image/jpeg', 'video/mp4']`);
    }

    const oss = new window.ComposeOss({
        ossType, // 存储商: OSS (阿里云) / QINIU (七牛云) / COS (腾讯云) / VOD (腾讯云)
        uploadType, // 上传类型: direct (直传) / multipart (断点分片)
        multiple, // 是否允许多选
        maxSize, // 文件大小限制
        uploadImmediately: false, // 是否立刻上传
        token: {
            AccessKeyId: accessKeyId,
            AccessKeySecret: accessKeySecret,
            SecurityToken: securityToken,
            dir: directory,
            bucket: bucketName,
            region: 'oss-cn-shenzhen'
        },
        host: sourcePoint, // 上传host
        types, // 上传类型
        uploadButton: buttonId, // 上传触发元素id
        container: containerElement, // upload_button父元素
        handleExpire, // token认证错误
        fileAdded, // 文件添加回调
        progress, // 进度事件
        error, // 错误回调
        complete, // 完成回调
        completeQueue // 队列完成回调
    })

    let isDestroy = false

    let uploadingTasks: any = []

    return {
        async upload(file: any, uploadOptions: any = { timeout: 20000 }) {
            if (isDestroy) {
                throw new TypeError('oss sdk is destroyed')
            }

            const { timeout } = uploadOptions

            await delay(1000)

            if (!oss.uploader) {
                throw new TypeError('oss sdk, oss.uploader is undefined')
            }

            const taskPromise = new Promise((resolve, reject) => {
                const uploaderOptions = {
                    file,
                    token: oss.token,
                    host: oss.host,
                    ossType: oss.ossType,
                    ...oss.restOptions,
                    complete(res: any) {
                        resolve(res)
                    }
                }
                const task = new oss.uploader(uploaderOptions)
                task.start(() => null, reject)
                setTimeout(() => reject('oss sdk timeout'), timeout)
            })

            uploadingTasks.push(taskPromise)

            return taskPromise
        },
        async destroy() {
            await Promise.all(uploadingTasks)
            const comParentElem: any = containerElement.parentElement
            comParentElem.removeChild(containerElement)
            uploadingTasks = []
            isDestroy = true
        }
    }
}
