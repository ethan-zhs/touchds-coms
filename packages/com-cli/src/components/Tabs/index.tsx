import * as React from 'react'
import classNames from 'classnames'

const styles = require('./index.less')

interface ITabsProps {
    onChange: (activeKey: string) => void
    children: any
    activeKey: string
}

class Tabs extends React.PureComponent<ITabsProps, any> {
    constructor(props: ITabsProps) {
        super(props)
    }

    static TabPanel = function (props: any) {
        return props.children
    }

    render() {
        const { children = [], activeKey } = this.props

        return (
            <div className={styles['tabs']}>
                <div className={styles['tab-buttons']}>
                    {children.map((item: any) => (
                        <div
                            key={item.key}
                            className={classNames({
                                [styles['tab-button']]: true,
                                [styles['tab-button-active']]: activeKey === item.key
                            })}
                            onClick={() => this.handleTabClick(item.key)}>
                            {item.props.tab}
                        </div>
                    ))}
                </div>

                <div className={styles['tab-panels']}>
                    {children.map((item: any) => (
                        <div
                            key={item.key}
                            className={classNames({
                                [styles['tab-panel']]: true,
                                [styles['tab-panel-hide']]: activeKey !== item.key
                            })}>
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    handleTabClick = (activeKey: string) => {
        const { onChange = () => null } = this.props
        onChange(activeKey)
    }
}

export default Tabs
