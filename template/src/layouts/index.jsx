import React, { useMemo } from 'react'

function Layout({ children }) {
  return useMemo(() => {
    return (
      <div>
        <p>Index Layout</p>
        {children}
      </div>
    )
  }, [children])
}

export default Layout
