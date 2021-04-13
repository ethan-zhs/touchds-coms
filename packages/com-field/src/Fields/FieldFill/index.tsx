import * as React from 'react'
import Popover from '../Popover'

import ColorFill from './ColorFill'

import './index.less'

interface IFieldFillProps {
    flat?: Array<string>
    value?: string
    onChange?: (value: string) => void
}

class FieldFill extends React.PureComponent<IFieldFillProps, any> {
    constructor(props: IFieldFillProps) {
        super(props)

        this.state = {
            fillColor: '#000000'
        }
    }

    componentDidMount() {
        this.setState({
            fillColor: this.props.value || '#000000'
        })
    }

    componentDidUpdate(prevProps: IFieldFillProps) {
        if (this.props.value !== prevProps.value) {
            this.setState({
                fillColor: this.props.value || '#000000'
            })
        }
    }

    render() {
        const { fillColor } = this.state
        const { value } = this.props
        const ColorPickerCom = <ColorFill color={value} changeColor={this.changeColor} />

        return (
            <div className="color-field">
                <span className="color-fill">
                    <span style={{ background: value }} />
                </span>
                <input
                    className="color-fill-input"
                    value={fillColor}
                    onChange={this.colorFillChange}
                    onBlur={this.colorFillInputBlur}
                    onKeyUp={this.handleInputKeyUp}
                />

                <Popover content={ColorPickerCom}>
                    <img
                        draggable={false}
                        className="color-picker-btn"
                        src={require('../../assets/images/color_picker.png').default}
                    />
                </Popover>
            </div>
        )
    }

    changeColor = (color: string) => {
        const { onChange = () => null } = this.props
        onChange(color)
    }

    colorFillChange = (e: any) => {
        this.setState({
            fillColor: e.target.value
        })
    }

    handleInputKeyUp = (e: any) => {
        const keyCode = window.event ? e.keyCode : e.which
        keyCode === 13 && e.target.blur()
    }

    colorFillInputBlur = () => {
        const { fillColor } = this.state
        const { r, g, b, a, hex } = ColorFill.colorFormat(fillColor)

        const color = a >= 1 ? `#${hex}` : `rgba(${r}, ${g}, ${b}, ${a})`

        this.setState({ fillColor: color }, () => {
            this.changeColor(color)
        })
    }
}

export default FieldFill
