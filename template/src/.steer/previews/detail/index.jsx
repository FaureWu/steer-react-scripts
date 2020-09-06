import React, { useMemo, useCallback } from 'react'
import { history } from 'steer'
import { useDidMount, useWillUnmount } from 'beautiful-react-hooks'
import { dispatcher } from '@opcjs/zoro'
import { useLocation } from 'react-router-dom'
import { Tag } from 'antd'
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import Actions from '@/components/actions/actions'
import Page from '@/components/page/page'

import View from './components/view/view'
import Table from './components/table/table'

export default function () {
  const location = useLocation()
  const handleBack = useCallback(() => {
    history.goBack()
  }, [])

  useDidMount(() => {
    dispatcher.detailDetail.query(location.query)
  })

  useWillUnmount(() => {
    dispatcher.detailDetail.clear()
  })

  return useMemo(() => {
    return (
      <Page>
        <Page.Header
          title="详情页"
          description="详情页描述信息"
          onBack={handleBack}
          tags={
            <>
              <Tag icon={<CheckCircleOutlined />} color="success">
                成功
              </Tag>
              <Tag icon={<SyncOutlined spin />} color="processing">
                进行中
              </Tag>
              <Tag icon={<CloseCircleOutlined />} color="error">
                失败
              </Tag>
            </>
          }
          actions={
            <Actions max={3}>
              <Actions.Action type="text">辅助操作</Actions.Action>
              <Actions.Action type="primary">主操作</Actions.Action>
              <Actions.Action disabled>禁用操作</Actions.Action>
              <Actions.Action danger>危险操作</Actions.Action>
            </Actions>
          }
        />
        <View />
        <Table />
      </Page>
    )
  }, [handleBack])
}
