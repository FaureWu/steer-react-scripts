import React, { useMemo, useCallback } from 'react'
import { Result, Button } from 'antd'
import { history } from 'steer'
import Page from '@/components/page/page'

import styles from './404.less'

function NotFound() {
  const handleGoHome = useCallback(() => {
    history.replace('/')
  }, [])

  return useMemo(() => {
    return (
      <Page className={styles.container}>
        <Result
          status={404}
          title="404"
          subTitle="抱歉！你访问的页面不存在"
          extra={
            <Button type="primary" onClick={handleGoHome}>
              去首页
            </Button>
          }
        />
      </Page>
    )
  }, [handleGoHome])
}

export default NotFound
