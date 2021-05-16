import React from 'react'
import { Switch, Tag } from 'antd'
import dayjs from 'dayjs'
import { formatPrice, isUndefined, isNaN } from '@/utils/tool'
import { STATUS_T2L, STATUS_T2V, STATUS_V2L } from '@/services/common'

export function renderPrice(value, record, index) {
  if (isUndefined(value)) return ''

  return `¥${formatPrice(value)}`
}

export function createRenderEnumType(type) {
  return function (value, record, index) {
    return type[value] || value
  }
}

export function createRenderStatus(onChange) {
  return function (value, record, index) {
    return (
      <Switch
        checkedChildren={STATUS_T2L.ENABLE}
        unCheckedChildren={STATUS_T2L.DISABLE}
        checked={value === STATUS_T2V.ENABLE}
        onChange={(checked) => {
          if (checked) onChange(STATUS_T2V.ENABLE)
          else onChange(STATUS_T2V.DISABLE)
        }}
      ></Switch>
    )
  }
}

export function renderStatus(value, record, index) {
  return (
    <Tag color={value === STATUS_T2V.ENABLE ? '#108ee9' : undefined}>
      {STATUS_V2L[value]}
    </Tag>
  )
}

export function renderCount(value, record, index) {
  return value || 0
}

export function renderDateTime(value, record, index) {
  const timestamp = parseInt(value)

  if (isNaN(timestamp)) return value

  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}
