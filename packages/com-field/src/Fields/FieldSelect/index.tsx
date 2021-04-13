import React from 'react'
import classNames from 'classnames'

import './index.less'

type ISelectItem = { name: string; value: string }
interface IFieldSelect {
    showSearch?: boolean
    options?: ISelectItem[]
    placeholder?: string
    onChange?: (value: any) => void
    value?: string
}

export default class FieldSelect extends React.PureComponent<IFieldSelect, any> {
    private selector: any
    constructor(props: any) {
        super(props)

        this.state = {
            showOption: false,
            position: 'bottom',
            searchText: ''
        }

        this.selector = null
    }

    componentDidMount() {
        this.listenSelectBlur()
    }

    render() {
        const { value, options = [], showSearch = false, placeholder = '' } = this.props
        const { showOption, searchText, position } = this.state

        const valueOption: any = options.find((item: any) => item.value === value) || {}
        const optionList = options.filter((item: any) => item.name.includes(searchText))

        return (
            <div
                className="field-select"
                onClick={this.toggleOptions}
                ref={ref => {
                    this.selector = ref
                }}>
                <div className="field-select-text">
                    {showOption && showSearch ? (
                        <input
                            type="text"
                            autoFocus={true}
                            placeholder={valueOption.name ?? placeholder}
                            className="field-select-input"
                            onChange={this.handleInputChange}
                            onClick={e => e.stopPropagation()}
                        />
                    ) : (
                        <span
                            className={classNames({
                                ['field-select-value']: valueOption.value,
                                ['field-select-placeholder']: !valueOption.value
                            })}>
                            {valueOption.value ? valueOption.name : placeholder}
                        </span>
                    )}

                    <i className="icon-font icon-select"></i>
                </div>
                {showOption && (
                    <div
                        className={classNames({
                            ['field-select-list']: true,
                            ['field-select-list-top']: position === 'top'
                        })}>
                        {optionList.map((i, index) => {
                            return (
                                <div
                                    key={`${index}_${i.value}`}
                                    className={classNames({
                                        ['field-select-option']: true,
                                        ['field-selected']: value === i.value
                                    })}
                                    onClick={() => this.handleSelectChange(i.value)}>
                                    {i.name}
                                </div>
                            )
                        })}

                        {optionList.length <= 0 && (
                            <div
                                className={classNames({
                                    ['field-select-option']: true,
                                    ['field-nodata']: true
                                })}>
                                暂无数据
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }

    toggleOptions = () => {
        this.setState({
            showOption: !this.state.showOption
        })
    }

    listenSelectBlur = () => {
        document.body.addEventListener('click', e => {
            const { showOption } = this.state
            const targetInput = this.selector ? this.selector.querySelector('.field-select-input') : null
            if (targetInput && e.target !== targetInput && showOption) {
                const clear = setTimeout(() => {
                    this.setState({
                        showOption: false,
                        searchText: ''
                    })
                    clearTimeout(clear)
                }, 0)
            }
        })
    }

    handleSelectChange = (value: string) => {
        const { onChange = () => null } = this.props
        onChange(value)
    }

    handleInputChange = (e: any) => {
        this.setState({
            searchText: e.target.value.trim()
        })
    }
}
