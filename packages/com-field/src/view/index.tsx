'use strict'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import classNames from 'classnames'

import Fields from '../Fields'

import 'github-markdown-css/github-markdown.css'
import '../assets/styles/font.less'
import './index.less'

const MonacoEditor = require('react-monaco-editor').default

class App extends React.Component<any, any> {
    private config: any
    constructor(props: any) {
        super(props)
        this.state = {
            baseConfig: {},
            baseState: {},
            navKey: 'All'
        }

        this.config = {}
    }

    componentDidMount() {
        this.changeNavKey('Number')
    }

    render() {
        const { baseState, navKey, baseConfig } = this.state

        const fm = require(`../doc/${navKey}/README.md`)

        const componentList = [
            'Text',
            'Number',
            'ButtonRadio',
            'Checkbox',
            'Fill',
            'Font',
            'Group',
            'IconRadio',
            'Image',
            'ImageSelect',
            'Line',
            'Margin',
            'Radio',
            'Select',
            'Size',
            'Switch',
            'Suite'
        ]

        return (
            <div className="container">
                <div className="nav">
                    <div className="nav-header">Touchds Field UI</div>
                    <div
                        className={classNames({
                            ['nav-item']: true,
                            ['active']: navKey === 'All'
                        })}
                        onClick={() => this.changeNavKey('All')}>
                        全部
                    </div>
                    {componentList.map((name: string, index: number) => (
                        <div
                            className={classNames({
                                ['nav-item']: true,
                                ['active']: navKey === name
                            })}
                            key={index}
                            onClick={() => this.changeNavKey(name)}>
                            {name}
                        </div>
                    ))}
                </div>
                <div className="com">
                    <div className="com-header">组件预览</div>
                    <div className="com-body">
                        <Fields config={baseConfig} fieldState={baseState} onChange={this.changeBaseFieldState} />

                        <div className="config-json">
                            <div className="config-json-title">JSON 配置</div>
                            <MonacoEditor
                                width={'100%'}
                                height={'360'}
                                language={'json'}
                                theme={'vs-dark'}
                                options={{
                                    automaticLayout: true,
                                    wordWrap: 'off',
                                    scrollbar: {
                                        horizontal: 'auto',
                                        vertical: 'auto'
                                    }
                                }}
                                value={JSON.stringify(require(`../doc/${navKey}/config.json`), null, 2)}
                            />
                        </div>
                    </div>
                </div>
                <div className="doc markdown-body" dangerouslySetInnerHTML={{ __html: fm.html }}></div>
            </div>
        )
    }

    changeNavKey = (key: string) => {
        const baseConfig = require(`../doc/${key}/config.json`)
        this.setState({
            navKey: key,
            baseConfig,
            baseState: this.initState(baseConfig)
        })
    }

    initState = (config: any) => {
        return Object.keys(config).reduce((result: any, key: any) => {
            const { default: initValue, children } = config[key]
            if (children && Object.getOwnPropertyNames(children).length) {
                result = {
                    ...result,
                    ...this.initState(children)
                }
            } else {
                result[key] = initValue
            }

            return result
        }, {})
    }

    changeBaseFieldState = (key: string, value: any) => {
        this.setState(
            Object.assign({}, this.state, {
                baseState: Object.assign({}, this.state.baseState, { [key]: value })
            })
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))
