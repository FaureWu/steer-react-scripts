import React, { useMemo, useState, useCallback } from 'react'
import { Row, Col, Skeleton, Spin, Empty, message } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { useDidMount } from 'beautiful-react-hooks'
import { useOnce } from '@/utils/hook'
import { noop } from '@/utils/tool'

import { getEditorTemplates, previewPage } from '../../service'

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

  const handlePreview = useCallback((e, template) => {
    e.stopPropagation()
    message.loading('预览页面生成中！', 0)
    previewPage({
      template,
      value: template.value,
    })
      .then((url) =>
        window.open(
          `${window.location.origin}${process.env.REACT_APP_OPEN_LAYOUT}#${url}`,
        ),
      )
      .finally(() => {
        message.destroy()
      })
  }, [])

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
                    <div
                      className={styles.icon}
                      title="预览"
                      onClick={(e) => handlePreview(e, template)}
                    >
                      <EyeOutlined />
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Spin>
      </Skeleton>
    )
  }, [handlePreview, loading, onSelect, skeleton, templates])
}

export default Template
