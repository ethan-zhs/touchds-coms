import React from 'react'
import classNames from 'classnames'

import './index.less'

type ISelectItem = { name: string; value: string; url: string }
interface IFieldImageSelect {
    options?: ISelectItem[]
    placeholder?: string
    onChange?: (value: any) => void
    value?: any
}

class FieldImageSelect extends React.PureComponent<IFieldImageSelect, any> {
    private selector: any
    constructor(props: IFieldImageSelect) {
        super(props)

        this.state = {
            showOption: false,
            position: 'bottom'
        }

        this.selector = null
    }

    componentDidMount() {
        this.listenSelectBlur()
    }

    render() {
        const { value, options = [], placeholder } = this.props
        const { showOption, position } = this.state
        const valueOption: any = options.find((item: any) => item.value === value) || {}

        return (
            <div
                className="field-image-select"
                onClick={this.toggleOptions}
                ref={ref => {
                    this.selector = ref
                }}>
                <div className="field-image-select-text">
                    <div className="field-image-select-value">
                        <div className="field-select-value-img">
                            {valueOption.url && <img src={valueOption.url} alt={valueOption.value} />}
                        </div>
                        <span
                            className={classNames({
                                ['field-select-value-text']: valueOption.value,
                                ['field-image-select-placeholder']: !valueOption.value
                            })}>
                            {valueOption.value ? valueOption.name : placeholder}
                        </span>
                    </div>

                    <i className="icon-font icon-select"></i>
                </div>
                {showOption && (
                    <div
                        className={classNames({
                            ['field-image-select-list']: true,
                            ['field-image-select-list-top']: position === 'top'
                        })}>
                        {options.map((i, index) => {
                            return (
                                <div
                                    key={`${index}_${i.value}`}
                                    title={i.name}
                                    className={classNames({
                                        ['field-image-select-option']: true,
                                        ['field-image-select-selected']: value === i.value
                                    })}
                                    onClick={() => this.handleSelectChange(i.value)}>
                                    <div className="field-image-select-imgbox">
                                        <img src={i.url} alt={i.value} />
                                    </div>
                                    <div className="field-select-text">{i.name}</div>
                                </div>
                            )
                        })}

                        {options.length <= 0 && (
                            <div
                                className={classNames({
                                    ['field-image-select-option']: true,
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
            const targetInput = this.selector ? this.selector.querySelector('.field-image-select-input') : null
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
}

export default FieldImageSelect
