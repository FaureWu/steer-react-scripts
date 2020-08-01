import React, { useMemo } from 'react'

function Main({ children }) {
  return useMemo(() => {
    return (
      <div>
        <p>Main Layout</p>
        {children}
      </div>
    )
  }, [children])
}

export default Main
