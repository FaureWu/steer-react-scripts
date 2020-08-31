import React from 'react'

import LIndex from '/Volumes/Code/workspace/steer/steer-react-scripts/template/src/.steer/layouts/index.jsx'

const LayoutComponents = {
  index: LIndex,
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
