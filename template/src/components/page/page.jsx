import React, { useState, useMemo } from 'react'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'
import { useDidMount } from 'beautiful-react-hooks'

import Sider from './sider'
import Header from './header'
import Footer from './footer'

import styles from './page.less'

function Page({ children, className, transparent, animation = true }) {
  const [visible, setVisible] = useState(false)

  useDidMount(() => {
    if (animation) setVisible(true)
  })

  const { headerEle, footerEle, siderEle, contentEle } = useMemo(() => {
    return React.Children.toArray(children).reduce(
      (_, child) => {
        if (child.type === Sider) _.siderEle = child
        else if (child.type === Header) _.headerEle = child
        else if (child.type === Footer) _.footerEle = child
        else _.contentEle.push(child)

        return _
      },
      {
        contentEle: [],
      },
    )
  }, [children])

  const containerEle = useMemo(() => {
    if (headerEle || footerEle || siderEle) {
      if (siderEle) {
        return (
          <div className={styles.container}>
            {siderEle}
            <div className={classNames(styles.content, styles.auto)}>
              {contentEle}
            </div>
          </div>
        )
      }

      return <div className={styles.content}>{contentEle}</div>
    }

    return contentEle
  }, [contentEle, footerEle, headerEle, siderEle])

  return useMemo(() => {
    return (
      <CSSTransition in={visible} classNames="pop" timeout={300}>
        <div
          className={classNames(styles.page, className, {
            [styles.transparent]: transparent,
          })}
        >
          {headerEle}
          {containerEle}
          {footerEle}
        </div>
      </CSSTransition>
    )
  }, [className, containerEle, footerEle, headerEle, transparent, visible])
}

Page.Sider = Sider
Page.Header = Header
Page.Footer = Footer

export default Page
