import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

const styles = require('./index.less')

function showMessage(MessageCom: any) {
    return function (...args: any) {
        const messageElem = document.createElement('div')
        const [content, duration] = args

        messageElem.setAttribute('class', styles['message-wrap'])
        document.body.appendChild(messageElem)
        ReactDOM.render(<MessageCom content={content} />, messageElem)

        const timer = setTimeout(() => {
            document.body.removeChild(messageElem)
            clearTimeout(timer)
        }, (duration || 2) * 1000)
    }
}

function Success(props: any) {
    const { content } = props

    return (
        <div
            className={classNames({
                [styles['message-content']]: true,
                [styles['message-success']]: true
            })}>
            <svg viewBox="0 0 1024 1024" width="20" height="20">
                <path d="M512 64C264.58 64 64 264.58 64 512s200.58 448 448 448 448-200.57 448-448S759.42 64 512 64z m238 359.1L478.42 694.63a32 32 0 0 1-45.26 0l-135.79-135.8a32 32 0 0 1 45.26-45.25l113.16 113.16 248.9-248.9A32 32 0 0 1 750 423.1z"></path>
            </svg>
            {content}
        </div>
    )
}

function Error(props: any) {
    const { content } = props

    return (
        <div
            className={classNames({
                [styles['message-content']]: true,
                [styles['message-error']]: true
            })}>
            <svg viewBox="0 0 1024 1024" width="20" height="20">
                <path d="M512 64.303538c-247.25636 0-447.696462 200.440102-447.696462 447.696462 0 247.254314 200.440102 447.696462 447.696462 447.696462s447.696462-200.440102 447.696462-447.696462S759.25636 64.303538 512 64.303538zM710.491727 665.266709c12.491499 12.491499 12.489452 32.729425-0.002047 45.220924-6.246261 6.246261-14.429641 9.370415-22.611997 9.370415s-16.363689-3.121084-22.60995-9.366322L512 557.222971 358.730221 710.491727c-6.246261 6.246261-14.429641 9.366322-22.611997 9.366322s-16.365736-3.125177-22.611997-9.370415c-12.491499-12.491499-12.491499-32.729425 0-45.220924l153.268756-153.266709L313.50725 358.730221c-12.491499-12.491499-12.489452-32.729425 0.002047-45.220924s32.729425-12.495592 45.220924-0.004093l153.268756 153.268756 153.268756-153.268756c12.491499-12.491499 32.729425-12.487406 45.220924 0.004093s12.493545 32.729425 0.002047 45.220924L557.225017 512 710.491727 665.266709z"></path>
            </svg>
            {content}
        </div>
    )
}

class Message {
    static success = (content: string, duration?: number) => {
        return showMessage(Success)(content, duration)
    }

    static error = (content: string, duration?: number) => {
        return showMessage(Error)(content, duration)
    }
}

export default Message
