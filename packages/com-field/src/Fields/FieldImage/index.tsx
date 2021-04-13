import * as React from 'react'
import { createOssUploader } from './uploaderUtils'
import FieldText from '../FieldText'

import './index.less'

interface IFieldImageProps {
    token: any
    key?: string
    value: string
    onChange: (value: string) => void
}

declare global {
    interface Window {
        ComposeOss: any
    }
}

class FieldImage extends React.Component<IFieldImageProps, any> {
    constructor(props: IFieldImageProps) {
        super(props)

        this.state = {
            fileInputId: `upload-input${Math.round(Math.random() * 100000)}`,
            url: '',
            isUploading: false,
            uploadBtnVisible: false,
            isImageBroken: false
        }
    }

    componentDidUpdate(prevProps: IFieldImageProps) {
        if (this.props.value !== prevProps.value) {
            this.setState({
                isImageBroken: false
            })
        }
    }

    render() {
        const { value, onChange } = this.props
        const { uploadBtnVisible, fileInputId, isImageBroken, isUploading } = this.state

        return (
            <div className="background-img">
                <FieldText prefixIcon="link-gui" placeholder="输入图片地址" value={value} onChange={onChange} />

                <div
                    className="background-img-uploader"
                    onMouseEnter={this.uploaderHover}
                    onMouseLeave={this.uploaderLeave}
                    onDragEnter={this.handleDragEnter}
                    onDragOver={this.handleDragOver}
                    onDrop={this.handleDrop}>
                    <input
                        accept="image/png,image/jpeg,image/jpg,image/gif,.ico"
                        type="file"
                        className="fileinput"
                        id={fileInputId}
                        onChange={this.handleFileInputChange}
                    />

                    {isUploading ? (
                        <div className="img-loaderror">{/* <Icon type="loading" /> */}</div>
                    ) : value === '' ? (
                        <div className="img-empty" onClick={this.handleUploadImage}>
                            <i className="icon-font icon-image-placeholder" />
                            <div>点击或拖拽文件到这里更换</div>
                        </div>
                    ) : (
                        <div style={{ width: '100%', height: '100%' }}>
                            {isImageBroken ? (
                                <div className="img-loaderror">
                                    <i className="icon-font icon-image-error" />
                                </div>
                            ) : (
                                <img src={value} onError={this.imgLoadError} />
                            )}

                            {uploadBtnVisible && (
                                <div className="uploader-btn">
                                    <span onClick={this.handleUploadImage}>更改</span>
                                    <span>|</span>
                                    <span onClick={this.handleDeleteImage}>删除</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    imgLoadError = () => {
        this.setState({ isImageBroken: true })
    }

    handleDragEnter = (e: any) => {
        e.preventDefault()
    }

    handleDragOver = (e: any) => {
        e.preventDefault()
    }

    handleDrop = async (e: any) => {
        e.stopPropagation()
        e.preventDefault()

        const files = e.dataTransfer.files // 获取文件
        this.uploadFiles(files[0])
    }

    handleFileInputChange = (e: any) => {
        const files = e.target.files
        this.uploadFiles(files[0])
    }

    handleUploadImage = () => {
        const uploadBtn: any = document.querySelector(`#${this.state.fileInputId}`)
        uploadBtn && uploadBtn.click()
    }

    handleDeleteImage = () => {
        this.props.onChange('')
    }

    handleInputKeyUp = (e: any) => {
        const keyCode = window.event ? e.keyCode : e.which
        keyCode === 13 && e.target.blur()
    }

    uploadFiles = async (file: File) => {
        const { token } = this.props
        const uploader = createOssUploader('OSS', token, token.imagePosition, {
            types: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', '.ico']
        })

        this.setState({ isUploading: true })
        try {
            const res: any = await uploader.upload(file)
            this.props.onChange(res.sourceLink)
        } catch (err) {
            console.log(err)
        }
        this.setState({ isUploading: false })
    }

    uploaderHover = () => {
        this.setState({ uploadBtnVisible: !this.state.uploadBtnVisible })
    }

    uploaderLeave = () => {
        this.setState({ uploadBtnVisible: false })
    }
}

export default FieldImage
