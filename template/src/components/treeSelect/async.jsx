import React, {
  useMemo,
  useCallback,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react'
import classNames from 'classnames'
import { useDidMount } from 'beautiful-react-hooks'
import { isFunction } from '@/utils/tool'
import { TreeSelect } from 'antd'

import styles from './treeSelect.less'

function Async(
  {
    dropdownMatchSelectWidth = false,
    className,
    treeData,
    children,
    value,
    ...props
  },
  ref,
) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(() => {
    if (!isFunction(treeData)) return

    setLoading(true)
    treeData()
      .then((data) => setData(data))
      .finally(() => setLoading(false))
  }, [treeData])

  const getData = useCallback(() => {
    return data
  }, [data])

  const handleFilter = useCallback((input = '', { title = '' }) => {
    return title.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }, [])

  useDidMount(() => {
    load()
  })

  useImperativeHandle(ref, () => ({
    load,
    getData,
  }))

  return useMemo(() => {
    return (
      <TreeSelect
        {...props}
        className={classNames(className, styles.tree)}
        value={loading ? undefined : value}
        treeData={data}
        loading={loading}
        dropdownMatchSelectWidth={dropdownMatchSelectWidth}
        filterOption={handleFilter}
      />
    )
  }, [
    className,
    data,
    dropdownMatchSelectWidth,
    handleFilter,
    loading,
    props,
    value,
  ])
}

export default forwardRef(Async)
