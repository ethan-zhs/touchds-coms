import * as React from 'react'
import semver from 'semver'

import './index.less'

interface IFieldTextProps {
    width?: number
    height?: number
    value?: string
    prefix?: string
    suffix?: string
    prefixIcon?: string
    suffixIcon?: string
    placeholder?: string
    isChangeImmediately?: boolean
    isVersion?: boolean
    onChange?: (value: string) => void
    onChangeImmediately?: (value: string) => void
}

class FieldText extends React.PureComponent<IFieldTextProps, any> {
    constructor(props: IFieldTextProps) {
        super(props)

        this.state = {
            inputValue: ''
        }
    }

    componentDidMount() {
        this.setState({
            inputValue: this.props.value ?? ''
        })
    }

    componentDidUpdate(prevProps: IFieldTextProps) {
        if (this.props.value !== prevProps.value) {
            this.setState({
                inputValue: this.props.value ?? ''
            })
        }
    }

    render() {
        const { inputValue } = this.state
        const {
            width = '100%',
            height = '24px',
            prefix,
            suffix,
            prefixIcon,
            suffixIcon,
            value,
            placeholder = '',
            isChangeImmediately
        } = this.props

        return (
            <div className="field-input" style={{ width, height }}>
                {prefixIcon && <i className={`icon-font icon-${prefixIcon} prefix-icon`}></i>}
                {prefix && <div className="field-input-prefix">{prefix}</div>}

                <input
                    className="input"
                    placeholder={placeholder}
                    value={isChangeImmediately ? value : inputValue}
                    onChange={this.handleChangeImmediately}
                    onBlur={() => this.handleInputChange(inputValue)}
                    onKeyUp={this.handlerInputKeyup}
                />

                {suffix && <div className="field-input-suffix">{suffix}</div>}
                {suffixIcon && <i className={`icon-font icon-${suffixIcon} suffix-icon`}></i>}
            </div>
        )
    }

    handleChangeImmediately = (e: any) => {
        const { onChangeImmediately = () => null } = this.props
        const value = e.target.value
        this.setState(
            {
                inputValue: value
            },
            () => {
                onChangeImmediately(value.trim())
            }
        )
    }

    handlerInputKeyup = (e: any) => {
        const keyCode = window.event ? e.keyCode : e.which
        keyCode === 13 && e.target.blur()
    }

    handleInputChange = (val: string) => {
        const { isVersion, value = '' } = this.props
        const { onChange = () => null } = this.props
        val = val.trim()

        if (isVersion && !semver.valid(val)) {
            val = value
        }

        this.setState({
            inputValue: val
        })

        onChange(val)
    }
}

export default FieldText
