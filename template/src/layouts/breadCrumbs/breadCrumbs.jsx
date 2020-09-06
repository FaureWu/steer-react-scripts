import React, { useMemo, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { Tag } from 'antd'
import { history } from 'steer'
import qs from 'qs'
import { dispatcher } from '@opcjs/zoro'
import { setBreadCrumbs, getBreadCrumbs } from '@/services/user'
import { routes } from '@/config/menu'
import { useModel } from 'steer'

import styles from './breadCrumbs.less'

function BreadCrumbs() {
  const breadCrumbs = useModel(({ user }) => user.breadCrumbs)
  const location = useLocation()

  const handleOpen = useCallback((breadCrumb) => {
    history.push(breadCrumb.route)
  }, [])

  const handleClose = useCallback(
    (breadCrumb, breadCrumbIndex) => {
      const newBreadCrumbs = breadCrumbs.filter(
        (item, index) => breadCrumbIndex !== index,
      )
      setBreadCrumbs(newBreadCrumbs)
      dispatcher.user.update({ breadCrumbs: newBreadCrumbs })

      if (breadCrumb.pathname !== location.pathname) return

      let nextBreadCrumb = newBreadCrumbs[breadCrumbIndex]
      if (!nextBreadCrumb) nextBreadCrumb = newBreadCrumbs[breadCrumbIndex - 1]

      if (nextBreadCrumb) history.push(nextBreadCrumb.route)
      else if (location.pathname !== '/') history.push('/')
    },
    [breadCrumbs, location.pathname],
  )

  const renderBreadCrumb = useCallback(
    (breadCrumb, index) => {
      function close() {
        handleClose(breadCrumb, index)
      }

      function open() {
        handleOpen(breadCrumb)
      }

      return (
        <Tag
          key={breadCrumb.pathname}
          closable
          color={
            breadCrumb.pathname === location.pathname ? '#1890ff' : undefined
          }
          onClose={close}
          onClick={open}
        >
          {breadCrumb.title}
        </Tag>
      )
    },
    [handleClose, handleOpen, location.pathname],
  )

  return useMemo(() => {
    if (breadCrumbs.length <= 0) return null

    return (
      <div className={styles.breadCrumbs}>
        {breadCrumbs.slice(-10).map(renderBreadCrumb)}
      </div>
    )
  }, [breadCrumbs, renderBreadCrumb])
}

export function updateBreadCrumbs({ pathname, search }) {
  const breadCrumbs = getBreadCrumbs()

  if (breadCrumbs.length <= 0 && pathname === '/') return

  const currentBreadCrumbIndex = breadCrumbs.findIndex(
    (item) => item.pathname === pathname,
  )
  const query = qs.parse(search.replace('?', ''))
  const currentRoute = routes.find((item) => item.route === pathname)
  const route = {
    title: decodeURIComponent(
      query.name || (currentRoute && currentRoute.title) || '无标题',
    ),
    route: `${pathname}${decodeURIComponent(search)}`,
    pathname,
  }
  if (currentBreadCrumbIndex === -1) {
    breadCrumbs.push(route)
  } else {
    breadCrumbs[currentBreadCrumbIndex] = route
  }

  setBreadCrumbs(breadCrumbs)
  dispatcher.user.update({ breadCrumbs })
}

export default BreadCrumbs
