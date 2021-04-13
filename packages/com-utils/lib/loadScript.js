export function createScript(url) {
    return new Promise(resolve => {
        const script = document.createElement('script')

        script.setAttribute('type', 'text/javascript')
        script.setAttribute('src', url)
        script.onload = async res => {
            resolve(res)
        }

        document.body.appendChild(script)
    })
}

export function loadDependence(pkgs, fn, dstUrl) {
    const defaultDstUrl = 'https://domain/sitecdn'
    return async function (...args) {
        for (const p in pkgs) {
            const pkgCdn = `${dstUrl || defaultDstUrl}/touchds/npm/${p}/${pkgs[p].replace('^', '')}/index.js`
            await createScript(pkgCdn)
        }

        return fn.apply(this, args)
    }
}
