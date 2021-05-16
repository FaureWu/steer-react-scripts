import {
  getOptions,
  getType2Value,
  getType2Label,
  getValue2Label,
} from '@/utils/type'

/**
 * 通用状态定义
 */
const STATUS = {
  ENABLE: { label: '启用', value: 'ENABLED' },
  DISABLE: { label: '禁用', value: 'DISABLED' },
}
export const STATUS_OPTIONS = getOptions(STATUS)
export const STATUS_T2V = getType2Value(STATUS)
export const STATUS_T2L = getType2Label(STATUS)
export const STATUS_V2L = getValue2Label(STATUS)
