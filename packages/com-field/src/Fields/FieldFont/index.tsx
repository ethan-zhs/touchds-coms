import React from 'react'

import FieldSuite from '../FieldSuite'

import './index.less'

const config = require('./config.json')

interface IFieldFontProps {
    value?: any
    components?: string[]
    onChange?: (value: number) => void
}

class FieldFont extends React.PureComponent<IFieldFontProps, any> {
    constructor(props: IFieldFontProps) {
        super(props)

        this.state = {
            fieldList: []
        }
    }

    render() {
        const { value } = this.props
        const childrens = this.configFilter()

        return (
            <div className="field-suite">
                <FieldSuite onChange={this.handleChangeValue} childrens={childrens} value={value} />
            </div>
        )
    }

    configFilter = () => {
        const { components = [] } = this.props
        const keys = Object.getOwnPropertyNames(config) || []
        let childrens: any = {}

        keys.forEach((key: string) => {
            if (components.length && components.includes(key)) {
                childrens[key] = config[key]
            }
        })

        // components 为空时直接取config
        childrens = components.length ? childrens : config

        return childrens
    }

    handleChangeValue = (value: any) => {
        const { onChange = () => null } = this.props
        onChange(value)
    }
}

export default FieldFont
