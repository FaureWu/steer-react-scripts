import React, { useMemo, useState, useCallback, useRef } from 'react'
import { Steps, Button, Space, message } from 'antd'
import { history } from 'steer'
import Page from '@/components/page/page'

import Template from './components/template/template'
import Param from './components/param/param'
import Result from './components/result/result'
import { createPage, previewPage } from './service'

import styles from './index.less'

function Editor() {
  const [current, setCurrent] = useState(0)
  const [template, setTemplate] = useState({})
  const [params, setParams] = useState({})
  const [preview, setPreview] = useState(false)
  const [create, setCreate] = useState(false)
  const paramRef = useRef(null)
  const resultRef = useRef(null)

  const handleParamsChange = useCallback((values) => {
    setParams(values)
  }, [])

  const handleSelect = useCallback((data) => {
    setTemplate(data)
    setCurrent(1)
  }, [])

  const handlePrev = useCallback(() => {
    setCurrent(current - 1)
  }, [current])

  const handleNext = useCallback(() => {
    setCurrent(current + 1)
    paramRef.current.submit()
  }, [current])

  const handleSubmit = useCallback(() => {
    resultRef.current.submit()
  }, [])

  const handlePreview = useCallback(() => {
    message.loading('预览页面生成中！', 0)
    setPreview(true)
    previewPage({
      template,
      value: params,
    })
      .then((url) => window.open(`${window.location.origin}/index#${url}`))
      .finally(() => {
        message.destroy()
        setPreview(false)
      })
  }, [params, template])

  const handleCreate = useCallback(
    (values) => {
      const path = values.path
        .split('/')
        .filter((item) => item)
        .join('/')

      message.loading('页面生成中！', 0)
      setCreate(true)
      createPage({ template, path, value: params })
        .then((url) => {
          debugger
          history.push(url)
        })
        .finally(() => {
          message.destroy()
          setCreate(false)
        })
    },
    [params, template],
  )

  return useMemo(() => {
    return (
      <Page>
        <Page.Header
          title="模版代码生成"
          description="参数配置完成，可先行预览效果后生成模版"
        >
          <Steps current={current} size="small">
            <Steps.Step title="选择模版" />
            <Steps.Step title="模版参数" />
            <Steps.Step title="生成模版" />
          </Steps>
        </Page.Header>
        {current === 0 && <Template onSelect={handleSelect} />}
        {current === 1 && (
          <Param
            ref={paramRef}
            config={template.config}
            onSubmit={handleParamsChange}
          />
        )}
        {current === 2 && <Result ref={resultRef} onSubmit={handleCreate} />}
        {current !== 0 && (
          <Page.Footer className={styles.footer}>
            <Button type="primary" onClick={handlePrev}>
              上一步
            </Button>
            {current === 1 && (
              <Button type="primary" onClick={handleNext}>
                下一步
              </Button>
            )}
            {current === 2 && (
              <Space>
                <Button type="link" onClick={handlePreview} loading={preview}>
                  预 览
                </Button>
                <Button type="primary" onClick={handleSubmit} loading={create}>
                  生 成
                </Button>
              </Space>
            )}
          </Page.Footer>
        )}
      </Page>
    )
  }, [
    create,
    current,
    handleCreate,
    handleNext,
    handleParamsChange,
    handlePrev,
    handlePreview,
    handleSelect,
    handleSubmit,
    preview,
    template.config,
  ])
}

export default Editor
