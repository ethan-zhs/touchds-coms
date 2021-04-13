import * as React from 'react'
import classNames from 'classnames'

import './index.less'

interface IFieldSwitchProps {
    value?: boolean
    switchText?: { close: string; open: string }
    showText?: boolean
    onChange?: (value: any) => void
}

class FieldSwitch extends React.PureComponent<IFieldSwitchProps, any> {
    constructor(props: IFieldSwitchProps) {
        super(props)
    }

    render() {
        const { value = false, switchText = { open: '开', close: '关' }, showText = false } = this.props

        return (
            <div className="field-switch">
                <div
                    onClick={this.handleChangeValue}
                    className={classNames({
                        ['field-switch-com']: true,
                        ['field-switch-open']: value === true
                    })}
                />
                {showText && (
                    <span className="field-switch-text">{value === true ? switchText.open : switchText.close}</span>
                )}
            </div>
        )
    }

    handleChangeValue = () => {
        const { onChange = () => null, value = false } = this.props

        onChange(!value)
    }
}

export default FieldSwitch
