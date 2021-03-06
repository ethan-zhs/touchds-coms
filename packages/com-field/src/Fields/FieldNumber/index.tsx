import * as React from 'react'

import FieldText from '../FieldText'

import './index.less'

interface IFieldNumberProps {
    width?: number
    prefix?: string
    suffix?: string
    value?: number
    step?: number
    min?: number
    max?: number
    range?: any
    showRange?: boolean
    showRangeText?: boolean
    onChange?: (value: number) => void
    onChangeImmediately?: (value: number) => void
}

class FieldNumber extends React.PureComponent<IFieldNumberProps, any> {
    constructor(props: IFieldNumberProps) {
        super(props)
        this.state = {
            inputValue: 0,
            sliderValue: 100,
            min: undefined,
            max: undefined
        }
    }

    componentDidMount() {
        this.initMinAndMax()
    }

    componentDidUpdate(prevProps: IFieldNumberProps) {
        if (this.props.value !== prevProps.value) {
            this.changeNumberValue(this.props.value)
        }
    }

    render() {
        const { inputValue, sliderValue, min, max } = this.state
        const { width = '100%', prefix, suffix, showRange = false, showRangeText = false } = this.props

        return (
            <div className="field-number">
                {showRange && (
                    <div className="field-number-slider">
                        {showRangeText && (
                            <div className="field-number-slider-text">
                                <span>{min}</span>
                                <span>{max}</span>
                            </div>
                        )}
                        <input
                            type="range"
                            value={sliderValue}
                            onChange={this.slideChange}
                            className="input-range"
                            style={{
                                background: `linear-gradient(to right, rgb(0, 251, 255),
                                            rgb(0, 176, 255) ${sliderValue / 10 + 1}%,
                                            rgb(38, 42, 53) ${(sliderValue + 10) * 1.1}%,
                                            rgb(38, 42, 53))`
                            }}
                        />
                    </div>
                )}

                <div className="number-field" style={{ width }}>
                    <FieldText
                        value={inputValue}
                        prefix={prefix}
                        suffix={suffix}
                        onChangeImmediately={this.handleInputChange}
                        onChange={this.handleNumChange}
                        isChangeImmediately={true}
                    />

                    <div className="number-field-button">
                        <span className="add-btn" onClick={this.stepAdd}>
                            +
                        </span>
                        <span className="minus-btn" onClick={this.stepMinus}>
                            -
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    // ????????? min ??? max
    initMinAndMax = () => {
        const { min, max, range = [], value } = this.props
        let minNum = min,
            maxNum = max

        if (minNum === undefined || maxNum === undefined) {
            if (range.min !== undefined && range.max !== undefined) {
                minNum = range.min
                maxNum = range.max
            } else if (range.length >= 2) {
                minNum = range[0]
                maxNum = range[1]
            }
        }

        minNum = minNum === undefined ? -12000 : minNum
        maxNum = maxNum === undefined ? 12000 : maxNum

        this.setState(
            {
                min: minNum,
                max: maxNum
            },
            () => {
                this.changeNumberValue(value)
            }
        )

        return { min: minNum, max: maxNum }
    }

    handleChangeValue = (value: number) => {
        const { min, max } = this.state
        const { onChange = () => null } = this.props
        value = Math.round(value * 100) / 100
        value = value > max ? max : value < min ? min : value

        this.setState(
            {
                inputValue: value
            },
            () => {
                onChange(value)
            }
        )
    }

    slideChange = (e: any) => {
        const { min, max } = this.state
        const { step = 1 } = this.props
        const rate = e.target.value / 100

        const value = (max - min) * rate + min

        // ???????????????????????????
        const stepNum = value / step

        // ??????????????????, Math.round ??????????????????????????????, ???????????????????????????
        let newVal = Math.round(Math.abs(stepNum)) * step
        newVal = stepNum >= 0 ? newVal : -newVal

        this.handleChangeValue(newVal)
    }

    changeNumberValue = (value = 0) => {
        const { min, max } = this.state
        const { showRange = false } = this.props

        let sliderValue = 100
        if (showRange) {
            sliderValue = (value - min) / (max - min)
            sliderValue = sliderValue >= 1 ? 1 : sliderValue <= 0 ? 0 : sliderValue
            sliderValue = Math.round(sliderValue * 100)
        }

        this.setState({
            inputValue: value,
            sliderValue
        })
    }

    handlerInputKeyup = (e: any) => {
        const keyCode = window.event ? e.keyCode : e.which
        keyCode === 13 && e.target.blur()
    }

    handleInputChange = (value: string) => {
        const { onChangeImmediately = () => null } = this.props
        if (/^(\-|\+)?\d*(\.\d*)?$/.test(value)) {
            this.setState({
                inputValue: value
            })
            // ??????????????????????????????
            onChangeImmediately(Number(value) || 0)
        }
    }

    handleNumChange = (val: number | string) => {
        const { value = 0, step = 1 } = this.props

        // ???????????????????????????
        val = val === '' ? value : val

        // ??????????????????????????????????????????????????????????????????
        val = Number(val) === 0 || Number(val) ? Number(val) : value

        // ????????????????????????
        val = Math.round(val / step) * step

        this.handleChangeValue(val)
    }

    stepAdd = () => {
        const { inputValue } = this.state
        const { step = 1 } = this.props
        const value = Number(inputValue) + step

        this.handleChangeValue(value)
    }

    stepMinus = () => {
        const { inputValue } = this.state
        const { step = 1 } = this.props
        const value = Number(inputValue) - step

        this.handleChangeValue(value)
    }
}

export default FieldNumber
