import React, { useMemo } from 'react'
import { Result } from 'antd'
import { useModel, useQuery } from 'steer'
import { BulbOutlined } from '@ant-design/icons'
import Page from '@/components/page/page'

function Index() {
  const { userInfo } = useModel(({ user }) => user)
  const params = useQuery()
  console.log(params)

  return useMemo(() => {
    return (
      <Page>
        <Result
          icon={<BulbOutlined />}
          title={`你好！${userInfo.userName}`}
          subTitle="欢迎使用本系统"
        />
      </Page>
    )
  }, [userInfo])
}

export default Index
