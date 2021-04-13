import * as React from 'react'
import classNames from 'classnames'

import './index.less'

interface IPopoverProps {
    placement?: 'bottom-left' | 'bottom-right' | 'top-right' | 'top-left'
    children: any
    content: any
}

class Popover extends React.PureComponent<IPopoverProps, any> {
    private popover: any
    constructor(props: IPopoverProps) {
        super(props)

        this.state = {
            visible: false
        }
    }

    componentDidMount() {
        this.listenSelectBlur()
    }

    render() {
        const { children, content, placement = 'bottom-left' } = this.props
        return (
            <div className="field-popover" onClick={this.toggleCotent} ref={ref => (this.popover = ref)}>
                {children}
                {this.state.visible && (
                    <div
                        className={classNames({
                            ['field-popover-content']: true,
                            [placement]: true
                        })}
                        onClick={e => {
                            e.stopPropagation()
                        }}>
                        {content}
                    </div>
                )}
            </div>
        )
    }

    toggleCotent = () => {
        const { visible } = this.state
        this.setState({
            visible: !visible
        })
    }

    listenSelectBlur = () => {
        document.body.addEventListener('click', e => {
            const popover = this.popover

            if (popover && popover !== e.target && !popover.contains(e.target)) {
                this.setState({
                    visible: false
                })
            }
        })
    }
}

export default Popover
