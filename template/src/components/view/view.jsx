import React, { useMemo } from 'react'
import { Descriptions, Skeleton, Spin } from 'antd'
import { useOnce } from '@/utils/hook'

function View({
  children,
  actions,
  loading = false,
  skeletonRows = 5,
  ...props
}) {
  const [skeleton] = useOnce(loading)

  return useMemo(() => {
    return (
      <Skeleton
        active
        loading={skeleton}
        paragraph={{ rows: skeletonRows, width: '100%' }}
      >
        <Spin spinning={loading}>
          <Descriptions {...props} extra={actions}>
            {children}
          </Descriptions>
        </Spin>
      </Skeleton>
    )
  }, [actions, children, loading, props, skeleton, skeletonRows])
}

View.Item = Descriptions.Item

export default View
