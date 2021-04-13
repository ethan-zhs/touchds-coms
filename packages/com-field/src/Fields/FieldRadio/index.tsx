import * as React from 'react'
import classNames from 'classnames'

import './index.less'

interface IFieldRadioProps {
    value?: string
    options?: any
    optionCol?: number
    onChange?: (value: any) => void
}

class FieldRadio extends React.PureComponent<IFieldRadioProps, any> {
    constructor(props: IFieldRadioProps) {
        super(props)
    }

    render() {
        const { value, options = [], optionCol } = this.props

        return (
            <div className="field-radio">
                {options.map((item: any, index: number) => {
                    return (
                        <div
                            key={index}
                            onClick={() => this.handleChangeValue(item.value)}
                            style={{ width: optionCol }}
                            className={classNames({
                                ['field-radio-item']: true,
                                ['field-radio-active']: value === item.value
                            })}>
                            <div className="field-radio-inner"></div>
                            <span className="field-radio-text" title={item.name}>
                                {item.name}
                            </span>
                        </div>
                    )
                })}
            </div>
        )
    }

    handleChangeValue = (value: string) => {
        const { onChange = () => null } = this.props

        onChange(value)
    }
}

export default FieldRadio
