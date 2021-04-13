import * as React from 'react'
import classNames from 'classnames'

const styles = require('./index.less')

class Interaction extends React.Component<any, any> {
    constructor(props: any) {
        super(props)

        this.state = {
            activeKeys: []
        }
    }

    componentDidMount() {
        this.setState({})
    }

    render() {
        const { packageJson } = this.props
        const { touchds: { events = {} } = {} } = packageJson

        const keys = Object.getOwnPropertyNames(events)
        const { activeKeys } = this.state

        return (
            <React.Fragment>
                {keys.map(key => {
                    const fields = events[key].fields || {}
                    const fieldKeys = Object.getOwnPropertyNames(fields) || []
                    return (
                        <div className={styles['interaction-content']} key={key}>
                            <div className={styles['event-header']} onClick={() => this.handleEventHeaderClick(key)}>
                                {events[key].description}
                                <i
                                    className={classNames({
                                        ['icon-font icon-right-gui']: true,
                                        [styles['icon-right-active']]: activeKeys.includes(key)
                                    })}></i>
                            </div>
                            <div
                                className={styles['event-fields-box']}
                                style={{
                                    height: activeKeys.includes(key) ? `${fieldKeys.length * 40 + 41}px` : '0px'
                                }}>
                                <table className={styles['event-fields-mapping']}>
                                    <thead>
                                        <tr className={styles['fields-mapping-header-tr']}>
                                            <th>字段</th>
                                            <th>字段说明</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fieldKeys.map(fieldkey => (
                                            <tr key={fieldkey} className={styles['fields-mapping-body-tr']}>
                                                <td>
                                                    <span className={styles['ellipsis']}>{fieldkey}</span>
                                                </td>
                                                <td>
                                                    <span className={styles['ellipsis']}>
                                                        {fields[fieldkey].description}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                })}
            </React.Fragment>
        )
    }

    handleEventHeaderClick = (key: string) => {
        const { activeKeys } = this.state
        const _activeKeys = activeKeys.includes(key)
            ? activeKeys.filter((k: string) => k !== key)
            : [...activeKeys, key]

        this.setState({
            activeKeys: _activeKeys
        })
    }
}

export default Interaction
