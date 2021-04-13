import * as React from 'react'
import classNames from 'classnames'

import './index.less'

interface IFieldCheckBoxProps {
    value?: string[]
    options?: any
    optionCol?: number
    onChange?: (value: any) => void
}

class FieldCheckBox extends React.PureComponent<IFieldCheckBoxProps, any> {
    constructor(props: IFieldCheckBoxProps) {
        super(props)
    }

    render() {
        const { value = [], options = [], optionCol } = this.props

        return (
            <div className="field-checkbox">
                {options.map((item: any, index: number) => {
                    return (
                        <div
                            key={index}
                            onClick={() => this.handleChangeValue(item.value)}
                            style={{ width: optionCol }}
                            className={classNames({
                                ['field-checkbox-item']: true,
                                ['field-checkbox-active']: value.includes(item.value)
                            })}>
                            <div className="field-checkbox-outer">
                                <div className="field-checkbox-inner"></div>
                            </div>
                            <span className="field-checkbox-text" title={item.name}>
                                {item.name}
                            </span>
                        </div>
                    )
                })}
            </div>
        )
    }

    handleChangeValue = (val: string) => {
        const { onChange = () => null, value = [] } = this.props

        if (value.includes(val)) {
            value.splice(value.indexOf(val), 1)
        } else {
            value.push(val)
        }

        onChange(value)
    }
}

export default FieldCheckBox
