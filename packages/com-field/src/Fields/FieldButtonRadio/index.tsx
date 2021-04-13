import * as React from 'react'
import classNames from 'classnames'

import './index.less'

interface IFieldButtonRadioProps {
    value?: string
    options?: any
    evenlySplit?: boolean
    onChange?: (value: any) => void
}

class FieldButtonRadio extends React.PureComponent<IFieldButtonRadioProps, any> {
    constructor(props: IFieldButtonRadioProps) {
        super(props)
    }

    render() {
        const { value, options = [], evenlySplit = false } = this.props

        const totalWidth = options.reduce((sum: number, item: any) => (sum += Number(item.col || 0)), 0)

        return (
            <div className="field-button-radio">
                {options.map((item: any, index: number) => {
                    const width =
                        totalWidth !== 0 && !evenlySplit ? (Number(item.col || 0) / totalWidth) * 100 + '%' : undefined

                    return (
                        <button
                            key={index}
                            onClick={() => this.handleChangeValue(item.value)}
                            style={{ width }}
                            className={classNames({
                                ['field-button-radio-item']: true,
                                ['field-button-radio-active']: value === item.value,
                                ['field-button-radio-evenly-split']: evenlySplit || totalWidth === 0
                            })}>
                            {item.name}
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

export default FieldButtonRadio
