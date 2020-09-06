import React, { useMemo } from 'react'
import { useModel } from 'steer'
import dayjs from 'dayjs'
import View from '@/components/view/view'

export default function () {
  const { data } = useModel(({ detailDetail }) => detailDetail)
  const loading = useModel(({ loading }) => ({
    query: loading.effect['detailDetail/query'] || false,
  }))

  return useMemo(() => {
    return (
      <>
        <View title="基本信息" loading={loading.query}>
          <View.Item label="姓名">{data.name}</View.Item>
          <View.Item label="年龄">{data.age}</View.Item>
          <View.Item label="性别">{data.gender}</View.Item>
          <View.Item label="生日" span={3}>
            {dayjs(data.birthday).format('YYYY-MM-DD')}
          </View.Item>
          <View.Item label="地址" span={3}>
            {data.address}
          </View.Item>
        </View>
        <View title="简介信息" loading={loading.query}>
          <View.Item>{data.intro}</View.Item>
        </View>
      </>
    )
  }, [loading, data])
}
