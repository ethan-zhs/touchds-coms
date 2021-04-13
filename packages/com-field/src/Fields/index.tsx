import * as React from 'react'

import getFieldsWithType from './mapping'

import './index.less'

class Fields extends React.Component<any, any> {
    private _isMounted = false
    constructor(props: any) {
        super(props)
        this.state = {
            fieldList: []
        }
    }

    componentDidMount() {
        this._isMounted = true
        // this.loadField(this.props.config).then((fieldList: any) => {
        //     this._isMounted &&
        //         this.setState({
        //             fieldList
        //         })
        // })
        this.loadField(this.props.config)
    }

    componentDidUpdate(prevProps: any) {
        if (prevProps.config !== this.props.config) {
            this._isMounted = true
            this.loadField(this.props.config)
        }
    }

    componentWillUnmount() {
        // 防止卸载了组件后, componentDidMount执行setState
        this._isMounted = false
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

        // return fieldList

        this._isMounted &&
            this.setState({
                fieldList
            })
    }

    renderField = (field: any, fieldState: any) => {
        const { key, FieldItem, config } = field
        const { onChange = () => null } = this.props
        const { type, name, ...rest } = config[key]

        if (type === 'group') {
            return (
                <FieldItem
                    {...rest}
                    name={name}
                    key={key}
                    value={fieldState[key]}
                    onChange={(newVal: any) => {
                        onChange(key, newVal)
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
                            value={fieldState[key]}
                            onChange={(newVal: any) => {
                                onChange(key, newVal)
                            }}
                        />
                    </div>
                </div>
            )
        }
    }

    render() {
        const { fieldList = [] } = this.state
        const { fieldState } = this.props

        return (
            <div className="field">
                {fieldList.map((field: any) => {
                    return this.renderField(field, fieldState)
                })}
            </div>
        )
    }
}

export default Fields
