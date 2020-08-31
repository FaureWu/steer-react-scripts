import React, { useMemo } from 'react'
import { Tree as AntTree, Empty, Skeleton, Spin } from 'antd'
import { useOnce } from '@/utils/hook'
import { isArray, isFunction } from '@/utils/tool'

function Tree({
  loading = false,
  treeData,
  skeletonRows = 10,
  loadData,
  ...props
}) {
  const [skeleton] = useOnce(loading)

  return useMemo(() => {
    const isEmpty = !isArray(treeData) || treeData.length <= 0
    const isDynamic = isFunction(loadData)

    return (
      <Skeleton
        active
        title={false}
        loading={skeleton}
        paragraph={{ rows: skeletonRows, width: '100%' }}
      >
        <Spin spinning={!isDynamic && loading}>
          {isEmpty ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <AntTree {...props} treeData={treeData} />
          )}
        </Spin>
      </Skeleton>
    )
  }, [loadData, loading, props, skeleton, skeletonRows, treeData])
}

export default Tree
