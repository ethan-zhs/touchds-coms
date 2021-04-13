import React from 'react'

import './index.less'

interface IPanelProps {
    children?: any
}

class Panel extends React.PureComponent<IPanelProps, any> {
    private panel: any = null
    private _isMount = true
    constructor(props: IPanelProps) {
        super(props)

        this.state = {
            isOpen: false,
            height: 0
        }
    }

    componentDidMount() {
        this.setState({ height: this.panel.offsetHeight }, () => {
            this._isMount = true
            const timer = setTimeout(() => {
                this._isMount && this.setState({ height: '' })
                clearTimeout(timer)
            }, 300)
        })
    }

    componentWillUnmount() {
        this._isMount = false
    }

    render() {
        return (
            <div style={{ height: this.state.height }} className="field-group-panel">
                <div
                    className="field-group-panel-content"
                    ref={ref => {
                        this.panel = ref
                    }}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Panel
