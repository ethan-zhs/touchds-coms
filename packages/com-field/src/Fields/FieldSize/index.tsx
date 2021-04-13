import * as React from 'react'

import FieldNumber from '../FieldNumber'

import './index.less'

interface IFieldSizeProps {
    value: { width: number; height: number; isLock: boolean }
    onChange: (value: any) => void
}

class FieldSize extends React.PureComponent<IFieldSizeProps, any> {
    constructor(props: IFieldSizeProps) {
        super(props)

        this.state = {
            rate: 0
        }
    }

    componentDidMount() {
        this.initRate()
    }

    componentDidUpdate(preProps: IFieldSizeProps) {
        const { value: { isLock: preIsLock } = {} } = preProps
        const { value: { isLock: curIsLock } = {} } = this.props
        if (preIsLock !== curIsLock) {
            this.initRate()
        }
    }

    render() {
        const { value: { width = 0, height = 0, isLock = false } = {} } = this.props

        return (
            <div className="group-size">
                <FieldNumber value={width} min={0} onChange={this.changeLayerWidth} />
                <div className="lock-btn">
                    <i className={`icon-font ${isLock ? 'icon-link' : 'icon-unlink'}`} onClick={this.changeSizeLock} />
                </div>
                <FieldNumber value={height} min={0} onChange={this.changeLayerHeight} />
            </div>
        )
    }

    initRate = () => {
        const { value: { isLock = false, width = 0, height = 0 } = {} } = this.props
        isLock &&
            this.setState({
                rate: width !== 0 && height !== 0 ? width / height : 0
            })
    }

    changeLayerWidth = (value: number) => {
        this.changeLayerSize('w', value)
    }

    changeLayerHeight = (value: number) => {
        this.changeLayerSize('h', value)
    }

    changeLayerSize = (type: string, value: number) => {
        const { value: { width: w = 0, height: h = 0 } = {} } = this.props
        const newWidth = type === 'w' ? value : this.calcuteRelateVal(w, type, value)
        const newHeight = type === 'h' ? value : this.calcuteRelateVal(h, type, value)

        this.props.onChange({
            ...this.props.value,
            width: Math.floor(newWidth),
            height: Math.floor(newHeight)
        })
    }

    calcuteRelateVal = (v: number, type: string, val: number) => {
        const { value: { isLock = false } = {} } = this.props
        const { rate } = this.state
        if (isLock && rate !== 0) {
            return (type === 'h' ? rate : 1 / rate) * val
        }

        return v
    }

    changeSizeLock = () => {
        const { value = {}, value: { isLock = false } = {} } = this.props
        this.props.onChange({
            ...value,
            isLock: !isLock
        })
    }
}

export default FieldSize
