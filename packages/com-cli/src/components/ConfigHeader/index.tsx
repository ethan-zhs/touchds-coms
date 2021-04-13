import * as React from 'react'
import classNames from 'classnames'
import { callApi, apiPrefix } from '../../services/callApi'

import Message from '../Message'

const styles = require('./index.less')

class Data extends React.Component<any, any> {
    constructor(props: any) {
        super(props)

        this.state = {
            isRequesting: false
        }
    }

    render() {
        const { isRequesting } = this.state
        const { packageJson, type } = this.props
        const { touchds = {} } = packageJson
        return (
            <div className={styles.header}>
                <div>
                    <div>{touchds.cnName}</div>
                    <div className={styles.version}>
                        v{packageJson.version} | {packageJson.description}
                    </div>
                </div>
                <button
                    disabled={isRequesting}
                    onClick={this.handleOnClick}
                    className={classNames({
                        [styles['save-btn']]: type === '保存',
                        [styles['publish-btn']]: type === '发布',
                        [styles['disable']]: isRequesting
                    })}>
                    {isRequesting && (
                        <svg viewBox="0 0 1024 1024" width="15" height="15">
                            <path d="M512.511 21.483c-271.163 0-491.028 219.86-491.028 491.028 0 271.173 219.856 491.03 491.028 491.03 26.554 0 48.08-21.527 48.08-48.08 0-26.554-21.526-48.08-48.08-48.08-218.065 0-394.869-176.804-394.869-394.87 0-218.06 176.813-394.869 394.87-394.869 218.065 0 394.869 176.804 394.869 394.87 0 26.553 21.526 48.08 48.08 48.08 26.553 0 48.08-21.527 48.08-48.08 0-271.173-219.857-491.03-491.03-491.03z"></path>
                        </svg>
                    )}
                    {type}
                </button>
            </div>
        )
    }

    handleOnClick = () => {
        const clearTimer = setTimeout(() => {
            this.setState({ isRequesting: true })
            this.saveConfig()
            clearTimeout(clearTimer)
        }, 10)
    }

    saveConfig = async () => {
        try {
            await this.updatePackageJson()
            this.setState({ isRequesting: false })
            Message.success('配置保存成功')
        } catch (err) {
            Message.error('配置保存失败')
            this.setState({ isRequesting: false })
        }
    }

    updatePackageJson = async () => {
        await callApi(apiPrefix('/com/save'), 'POST', { config: this.props.packageJson })
    }

    publishComponent = async (newJson: any = {}) => {
        try {
            await this.updatePackageJson()
            await callApi(apiPrefix('/com/publish'), 'POST')
            await callApi(apiPrefix('/v1/com', 'http://127.0.0.1:8999/api'), 'POST', {
                comName: newJson.name,
                version: newJson.version,
                config: JSON.stringify(newJson.touchds?.config ?? {}),
                description: newJson.description,
                type: newJson.touchds?.type ?? '',
                comCnName: newJson.touchds?.cnName || newJson.name,
                thumbnail: newJson.touchds?.icon ?? ''
            })
            Message.success('组件发布成功')
        } catch (err) {
            Message.error('组件发布失败')
        }
    }
}

export default Data
