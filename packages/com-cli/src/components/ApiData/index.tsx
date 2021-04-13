import * as React from 'react'
import classNames from 'classnames'
import _ from 'lodash'

import Message from '../Message'

const MonacoEditor = require('react-monaco-editor').default
const styles = require('./index.less')

class Data extends React.Component<any, any> {
    constructor(props: any) {
        super(props)

        this.state = {
            isMapping: false,
            mapSuccessFields: []
        }
    }

    componentDidMount() {
        this.mappingField()
    }

    componentDidUpdate(prevProps: any) {
        if (this.props.packageJson !== prevProps.packageJson) {
            this.mappingField()
        }
    }

    render() {
        const { packageJson = {} } = this.props
        const fields = packageJson.touchds?.apis?.fields ?? {}
        const apiData = packageJson.touchds?.apiData ?? []

        const fieldsKeys = Object.getOwnPropertyNames(fields) || []

        const FIELD_MAPPING_STATUS = {
            mapping: '匹配中',
            failure: '未找到字段',
            success: '匹配成功'
        }

        const API_MAPPING_STATUS = {
            mapping: '匹配中',
            failure: '配置未完成',
            success: '配置完成'
        }

        const apiMapStatus = this.getApiMapStatus()

        return (
            <div className={styles['data']}>
                <div className={styles['api-mapping']}>
                    <span>数据接口</span>
                    <span
                        className={classNames({
                            [styles['api-mapping-status']]: true,
                            [styles[apiMapStatus]]: true
                        })}>
                        {API_MAPPING_STATUS[apiMapStatus]}
                    </span>
                </div>
                <table className={styles['api-fields-mapping-status']}>
                    <thead>
                        <tr className={styles['fields-mapping-header-tr']}>
                            <th>字段</th>
                            <th>描述</th>
                            <th>状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fieldsKeys.map((key: any) => {
                            const fieldMapStatus = this.getFieldMapStatus(key)
                            return (
                                <tr key={key} className={styles['fields-mapping-body-tr']}>
                                    <td>
                                        <span className={styles['ellipsis']}>{key}</span>
                                    </td>
                                    <td>
                                        <span className={styles['ellipsis']}>{fields[key].description}</span>
                                    </td>
                                    <td>
                                        <span
                                            className={classNames({
                                                [styles['ellipsis']]: true,
                                                [styles[fieldMapStatus]]: true
                                            })}>
                                            {FIELD_MAPPING_STATUS[fieldMapStatus]}
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className={styles['code-editor']}>
                    <MonacoEditor
                        width={'100%'}
                        height={'360'}
                        language={'json'}
                        theme={'vs-dark'}
                        options={{
                            automaticLayout: true,
                            wordWrap: 'on',
                            scrollbar: {
                                horizontal: 'visible'
                            }
                        }}
                        value={JSON.stringify(apiData, null, 2)}
                        editorDidMount={this.editorDidMount}
                    />
                </div>
            </div>
        )
    }

    getApiMapStatus = () => {
        const { packageJson = {} } = this.props
        const fields = packageJson.touchds?.apis?.fields ?? {}
        const { mapSuccessFields, isMapping } = this.state

        const fieldsKeys = Object.getOwnPropertyNames(fields) || []
        const mapLength = mapSuccessFields.length

        if (isMapping) {
            return 'mapping'
        }

        return mapLength === fieldsKeys.length ? 'success' : 'failure'
    }

    getFieldMapStatus = (key: string) => {
        const { mapSuccessFields, isMapping } = this.state

        if (isMapping) {
            return 'mapping'
        }

        return mapSuccessFields.includes(key) ? 'success' : 'failure'
    }

    mappingField = async (apiData?: any) => {
        const { packageJson = {} } = this.props
        const fields = packageJson.touchds?.apis?.fields ?? {}
        const fieldKeys = Object.getOwnPropertyNames(fields)
        const mapSuccessFields: string[] = []

        apiData = apiData || (packageJson.touchds?.apiData ?? [])

        await this.setState({
            isMapping: true
        })

        fieldKeys.forEach((key: string) => {
            const isMapping = apiData.every((dataItem: any) => {
                const dataKeys = Object.getOwnPropertyNames(dataItem)
                return dataKeys.includes(key)
            })

            if (isMapping) {
                mapSuccessFields.push(key)
            }
        })

        await this.setState({
            isMapping: false,
            mapSuccessFields
        })
    }

    editorDidMount = (editor: any) => {
        editor.onDidBlurEditorWidget(async () => {
            try {
                const { packageJson = {}, onChange = () => null } = this.props
                const newData = JSON.parse(editor.getValue())
                await this.mappingField(newData)

                const newJson = _.cloneDeep(packageJson)

                if (this.getApiMapStatus() !== 'success') {
                    Message.error('数据字段配置的不正确')
                }

                if (newJson.touchds) {
                    newJson.touchds.apiData = newData
                    onChange(newJson)
                }
            } catch (err) {
                Message.error('数据格式错误')
            }
        })
    }
}

export default Data
