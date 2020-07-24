import React, { useMemo } from 'react'

function Loading() {
  return useMemo(() => {
    return <div>loading</div>
  }, [])
}

export default Loading
