import * as React from 'react'
import classNames from 'classnames'

import './index.less'

interface IFieldIconRadioProps {
    value?: string
    options?: any
    evenlySplit?: boolean
    onChange?: (value: any) => void
}

class FieldIconRadio extends React.PureComponent<IFieldIconRadioProps, any> {
    constructor(props: IFieldIconRadioProps) {
        super(props)
    }

    render() {
        const { value, options = [], evenlySplit = false } = this.props

        return (
            <div className="field-icon-radio">
                {options.map((item: any, index: number) => {
                    return (
                        <button
                            key={index}
                            onClick={() => this.handleChangeValue(item.value)}
                            className={classNames({
                                ['field-icon-radio-item']: true,
                                ['field-icon-radio-active']: value === item.value,
                                ['field-icon-radio-evenly-split']: evenlySplit
                            })}>
                            {item.url ? (
                                <img className="field-icon-radio-image" src={item.url} alt={item.value} />
                            ) : (
                                item.icon && <i className={`icon-font icon-${item.icon}`}></i>
                            )}
                        </button>
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

export default FieldIconRadio
