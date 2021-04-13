import UserComponent from '@component-entry'
import UserPackageJson from '@component-packagejson'

const { name, version } = UserPackageJson
const touchdsCom = window.UserComponent || {}

window.touchdsCom = {
    ...touchdsCom,
    [`${name}-${version}`]: UserComponent
}
