import React, { useMemo, useCallback } from 'react'
import { useDidMount } from 'beautiful-react-hooks'
import { dispatcher } from '@opcjs/zoro'
import { useModel } from 'steer'
import Tree from '@/components/tree/tree'

export default function () {
  const { treeData } = useModel(({ crudTable }) => crudTable)
  const loading = useModel(({ loading }) => ({
    queryTree: loading.effect['crudTable/queryTree'] || false,
  }))

  useDidMount(() => {
    dispatcher.crudTable.queryTree()
  })

  const handleSelect = useCallback((selectedKeys, { selectedNodes }) => {
    const { children, ...node } = selectedNodes[0]
    dispatcher.crudTable.selectTree(node)
  }, [])

  return useMemo(() => {
    return (
      <Tree
        loading={loading.queryTree}
        treeData={treeData}
        onSelect={handleSelect}
      />
    )
  }, [loading, treeData, handleSelect])
}
