import React, { useMemo } from 'react'

function Layout({ children }) {
  return useMemo(() => {
    return <>{children}</>
  }, [children])
}

export default Layout
