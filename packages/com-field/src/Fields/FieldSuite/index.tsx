import React from 'react'

import getFieldsWithType from '../mapping'

import './index.less'

interface IFieldSuiteProps {
    value?: any
    childrens?: any
    onChange?: (value: number) => void
}

class FieldSuite extends React.PureComponent<IFieldSuiteProps, any> {
    constructor(props: IFieldSuiteProps) {
        super(props)

        this.state = {
            fieldList: []
        }
    }

    componentDidMount() {
        const { childrens = {} } = this.props
        this.loadField(childrens).then((fieldList: any) => {
            this.setState({
                fieldList
            })
        })
    }

    render() {
        const { value: fieldValues = {} } = this.props
        const { fieldList = [] } = this.state

        return (
            <div className="field-suite">
                {fieldList.map((field: any) => {
                    return this.renderField(field, fieldValues)
                })}
            </div>
        )
    }

    loadField = async (config: any) => {
        const fieldList: any = []

        const keys = Object.getOwnPropertyNames(config)

        if (config && keys.length) {
            for (const key in config) {
                const { type, name } = config[key]

                // 隐藏域不渲染表单组件
                if (type === 'hidden') {
                    continue
                }

                const FieldItem = await getFieldsWithType(type)

                const comObj = { name, key, FieldItem, config }

                fieldList.push(comObj)
            }
        }

        return fieldList
    }

    renderField = (field: any, fieldValues: any) => {
        const { key, FieldItem, config } = field
        const { caption, col, ...rest } = config[key]
        const colNum = col > 20 ? 24 : col

        return (
            <div className="suite-item" key={key} style={{ flex: `0 0 ${(colNum / 24) * 100}%` }}>
                <FieldItem
                    {...rest}
                    value={fieldValues[key]}
                    onChange={(newVal: any) => {
                        this.handleChangeValue(key, newVal)
                    }}
                />
                {caption && <div className="suite-item-text">{caption}</div>}
            </div>
        )
    }

    handleChangeValue = (key: string, val: any) => {
        const { onChange = () => null, value = {}, childrens = {} } = this.props

        const keys = Object.getOwnPropertyNames(childrens) || []
        keys.forEach((k: string) => {
            value[k] = value[k]
        })

        value[key] = val
        onChange(value)
    }
}

export default FieldSuite
