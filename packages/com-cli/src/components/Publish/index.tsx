import * as React from 'react'
import _ from 'lodash'

import '@touchds/com-field/dist/index.css'
const Fields = require('@touchds/com-field')
const config = require('./config.json')

const styles = require('./index.less')

class Publish extends React.Component<any, any> {
    constructor(props: any) {
        super(props)

        this.state = {
            fieldState: {}
        }
    }

    render() {
        const { packageJson } = this.props

        return (
            <div className={styles['publish']}>
                <Fields
                    config={config}
                    fieldState={this.getFieldState(packageJson)}
                    onChange={this.handleValueChange}
                />
            </div>
        )
    }

    // 获得各表单选项的value
    getFieldState = (packageJson: any = {}) => {
        const { touchds = {} } = packageJson

        return {
            baseProps: {
                size: touchds.size || {},
                cnName: touchds.cnName || '',
                description: packageJson.description
            },
            type: touchds.type || ['regular_pie'],
            icon: touchds.icon || '',
            version: packageJson.version || '0.0.1'
        }
    }

    handleValueChange = async (key: string, value: any) => {
        const { packageJson = {} } = this.props

        await this.setState({
            fieldState: Object.assign({}, this.getFieldState(packageJson), { [key]: value })
        })

        this.changePackageJson()
    }

    changePackageJson = () => {
        const { packageJson, onChange = () => null } = this.props
        const { fieldState } = this.state

        const newJson = _.cloneDeep(packageJson)

        newJson.version = fieldState.version || '0.0.1'
        newJson.description = fieldState.baseProps.description

        if (newJson.touchds) {
            newJson.touchds.icon = fieldState.icon
            newJson.touchds.cnName = fieldState.baseProps.cnName
            newJson.touchds.size = fieldState.baseProps.size
        }

        onChange(newJson)
    }
}

export default Publish
