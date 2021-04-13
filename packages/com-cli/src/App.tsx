'use strict'
import * as React from 'react'

import ConfigHeader from './components/ConfigHeader'
import Configuration from './components/Configuration'
import ApiData from './components/ApiData'
import Interaction from './components/Interaction'
import Publish from './components/Publish'
import Tabs from './components/Tabs'
import ToolTip from './components/ToolTip'

import { callApi, apiPrefix } from './services/callApi'

import './assets/styles/font.less'
const styles = require('./index.less')

const { TabPanel } = Tabs

class App extends React.Component<any, any> {
    private userComponent: any
    private comRef: any

    constructor(props: any) {
        super(props)
        this.state = {
            activeKey: 'config',
            packageJson: {}
        }

        this.comRef = React.createRef()
    }

    componentDidMount() {
        const { UserComponent } = this.props
        this.userComponent = new UserComponent(this.comRef.current, this.getConfig())

        this.initConfig()
    }

    componentDidUpdate() {
        this.userComponent.render(this.getConfig())
    }

    render() {
        const { packageJson, activeKey } = this.state
        const size = packageJson?.touchds?.size ?? {}

        const TAB_LIST = [
            {
                name: '配置',
                icon: 'icon-setting',
                key: 'config',
                Com: Configuration
            },
            {
                name: '数据',
                icon: 'icon-data-config',
                key: 'data',
                Com: ApiData
            },
            {
                name: '交互',
                icon: 'icon-interact',
                key: 'interact',
                Com: Interaction
            },
            {
                name: '发布',
                icon: 'icon-publish',
                key: 'publish',
                Com: Publish
            }
        ]

        return (
            <div className={styles['container']}>
                <div className={styles['left']}>
                    <div
                        ref={this.comRef}
                        className={styles['com-box']}
                        style={{
                            width: size.width ?? 300,
                            height: size.height ?? 300,
                            minWidth: size.minWidth ?? 300,
                            minHeight: size.minHeight ?? 300
                        }}></div>
                </div>
                <div className={styles['right']}>
                    <Tabs activeKey={activeKey} onChange={async activeKey => await this.setState({ activeKey })}>
                        {TAB_LIST.map(item => {
                            const { Com } = item

                            return (
                                <TabPanel
                                    key={item.key}
                                    tab={
                                        <ToolTip title={item.name}>
                                            <i className={`icon-font ${item.icon}`} />
                                        </ToolTip>
                                    }>
                                    <ConfigHeader
                                        packageJson={packageJson}
                                        type={item.key === 'publish' ? '发布' : '保存'}
                                    />
                                    <Com packageJson={packageJson} onChange={this.changePackageJson} />
                                </TabPanel>
                            )
                        })}
                    </Tabs>
                </div>
            </div>
        )
    }

    getConfig = () => {
        const { packageJson = {} } = this.state
        const { touchds = {} } = packageJson

        const config = Object.keys(touchds.config || {}).reduce((result: any, key: any) => {
            const { default: initValue } = touchds.config[key]
            result[key] = initValue

            return result
        }, {})

        return {
            config,
            apiData: touchds.apiData
        }
    }

    initConfig = async () => {
        const packageJson = await callApi(apiPrefix('/com/package.json'), 'GET')
        this.changePackageJson(packageJson)
    }

    changePackageJson = (newJson: any) => {
        this.setState({
            packageJson: newJson
        })
    }
}

export default App
