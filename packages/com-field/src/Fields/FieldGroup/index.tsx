import React from 'react'
import Panel from './Panel'

import getFieldsWithType from '../mapping'

import './index.less'

type IGroup = { Com?: any; children?: IGroup[] }

interface IFieldGroupProps {
    value?: any
    name: string
    open?: boolean
    childrens?: any
    onChange?: (value: any) => void
}

export default class FieldGroup extends React.PureComponent<IFieldGroupProps, any> {
    constructor(props: IFieldGroupProps) {
        super(props)

        this.state = {
            isOpen: props.open || false,
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
        const { value: fieldValues = {}, name = '' } = this.props
        const { isOpen, fieldList } = this.state
        return (
            <div className="field-group">
                <div className="field-group-header" onClick={this.changePanelVisible}>
                    <span>{name}</span>
                    <span className={isOpen ? 'show' : 'hide'}>
                        <i className="icon-font icon-right-gui"></i>
                    </span>
                </div>
                {isOpen && (
                    <Panel>
                        {fieldList.map((field: any) => {
                            return this.renderField(field, fieldValues)
                        })}
                    </Panel>
                )}
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
        const { name, type, ...rest } = config[key]

        if (type === 'group') {
            return (
                <FieldItem
                    {...rest}
                    key={key}
                    name={name}
                    value={fieldValues[key]}
                    onChange={(newVal: any) => {
                        this.handleChangeValue(key, newVal)
                    }}
                />
            )
        } else {
            return (
                <div className="form-item" key={key}>
                    <label className="form-label">{name}</label>
                    <div className="form-field">
                        <FieldItem
                            {...rest}
                            value={fieldValues[key]}
                            onChange={(newVal: any) => {
                                this.handleChangeValue(key, newVal)
                            }}
                        />
                    </div>
                </div>
            )
        }
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

    changePanelVisible = () => {
        const { isOpen } = this.state

        this.setState({
            isOpen: !isOpen
        })
    }
}
