import React from 'react'
import classNames from 'classnames'

const styles = require('./index.less')

interface IIconButtonProps {
    title: string
    placement?: 'top' | 'left' | 'right' | 'bottom'
    children: any
}

export default function Tooltip(props: IIconButtonProps) {
    const { placement = 'bottom', title, children } = props

    return (
        <div className={styles['tooltips-wrap']}>
            <div
                className={classNames({
                    [styles['tooltips']]: true,
                    [styles[placement]]: true
                })}>
                {title}
            </div>
            {children}
        </div>
    )
}
