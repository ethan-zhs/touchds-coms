import * as React from 'react'
import _ from 'lodash'

import '@touchds/com-field/dist/index.css'
const Fields = require('@touchds/com-field')

class Configuration extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
    }

    render() {
        const { packageJson } = this.props
        const touchds = packageJson?.touchds ?? {}

        return (
            <div>
                {touchds.config && (
                    <Fields
                        config={touchds.config}
                        fieldState={this.getFieldState(packageJson)}
                        onChange={this.handleValueChange}
                    />
                )}
            </div>
        )
    }

    // 获得各表单选项的value
    getFieldState = (packageJson: any = {}) => {
        const { touchds = {} } = packageJson

        return Object.keys(touchds.config || {}).reduce((result: any, key: any) => {
            const { default: initValue } = touchds.config[key]
            result[key] = initValue

            return result
        }, {})
    }

    // 修改packageJson
    handleValueChange = async (key: string, value: any) => {
        const { onChange = () => null, packageJson = {} } = this.props

        const newJson = _.cloneDeep(packageJson)

        if (newJson.touchds) {
            const config = newJson.touchds.config || {}
            config[key].default = value

            newJson.touchds.config = config
        }

        onChange(newJson)
    }
}

export default Configuration
