// https
const HTTP = 'http://'
// const HTTPS = 'https://';

// domain
const DOMAIN_TEST = `${HTTP}127.0.0.1:9000`

const baseName: any = {
    localhost: DOMAIN_TEST,
    '127.0.0.1': DOMAIN_TEST
}

const apiBaseName = baseName[window.location.hostname]

export const getApiBaseName = {
    api: apiBaseName + '/api'
}
