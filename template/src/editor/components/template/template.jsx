import React, { useMemo, useState } from 'react'
import { Row, Col, Skeleton, Spin, Empty } from 'antd'
import { useDidMount } from 'beautiful-react-hooks'
import { useOnce } from '@/utils/hook'
import { noop } from '@/utils/tool'

import { getEditorTemplates } from '../../service'

import styles from './template.less'

function Template({ onSelect = noop }) {
  const [loading, setLoading] = useState(false)
  const [templates, setTemplates] = useState([])
  const [skeleton] = useOnce(loading)

  useDidMount(() => {
    setLoading(true)
    getEditorTemplates()
      .then((data) => {
        setTemplates(data)
      })
      .finally(() => setLoading(false))
  })

  return useMemo(() => {
    return (
      <Skeleton
        active
        title={false}
        loading={skeleton}
        paragraph={{ rows: 8, width: '100%' }}
      >
        <Spin spinning={loading}>
          {templates.length <= 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <Row gutter={[16, 16]}>
              {templates.map((template) => (
                <Col key={template.name} span={6}>
                  <div
                    className={styles.template}
                    onClick={() => onSelect(template)}
                  >
                    {template.title}
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Spin>
      </Skeleton>
    )
  }, [loading, onSelect, skeleton, templates])
}

export default Template
