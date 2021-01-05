import React from 'react'

import LHorizontal from '@/.steer/layouts/horizontal.jsx'
import LVertical from '@/.steer/layouts/vertical.jsx'

const LayoutComponents = {
  horizontal: LHorizontal,
  vertical: LVertical,
}

function getLayoutComponent() {
  const match = window.location.pathname.match(/^\/([^/]+)\/?$/)
  if (match) return LayoutComponents[match[1]]
  return null
}

function Layout({ children }) {
  const LayoutComponent = getLayoutComponent()

  if (LayoutComponent) {
    return <LayoutComponent>{children}</LayoutComponent>
  }

  return children
}

export default Layout
