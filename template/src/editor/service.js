import request from '@/utils/request'

const apis = {
  getTemplates: '/templates',
  createPreviewPage: '/preview',
  createPage: '/create',
}

const service = Object.keys(apis).reduce(
  (_, key) => ({
    ..._,
    [key]: `${window.location.origin}${process.env.REACT_APP_API_PREFIX}${process.env.REACT_APP_TEMPLATE_EDITOR_ROUTE}${apis[key]}`,
  }),
  {},
)

export async function getEditorTemplates() {
  const { data = [] } = await request(service.getTemplates, {
    method: 'GET',
  })

  return data
}

export async function previewPage({ template, value }) {
  const { data } = await request(service.createPreviewPage, {
    method: 'POST',
    data: {
      template,
      value,
    },
  })

  return data
}

export async function createPage({ template, path, value }) {
  const { data } = await request(service.createPage, {
    method: 'POST',
    data: { template, value, path },
  })

  return data
}

/**
 * 获取表格数据
 */
export async function crudQuery(params) {
  const response = await request('/crud/query', {
    method: 'GET',
    data: params,
  })

  return response
}

/**
 * 创建表格项
 */
export async function crudCreate(params) {
  const response = await request('/crud/create', {
    method: 'POST',
    data: params,
  })

  return response
}

/**
 * 编辑表格项
 */
export async function crudEdit(params) {
  const response = await request('/crud/edit', {
    method: 'POST',
    data: params,
  })

  return response
}

/**
 * 删除表格项
 */
export async function curdDelete(params) {
  const response = await request('/crud/delete', {
    method: 'DELETE',
    data: params,
  })

  return response
}

/**
 * 获取表格项详情
 */
export async function crudDetail(params) {
  const response = await request('/crud/detail', {
    method: 'GET',
    data: params,
  })

  return response
}

/**
 * 获取表格筛选树
 */
export async function crudTree(params) {
  const response = await request('/crud/tree', {
    method: 'GET',
    data: params,
  })

  return response
}
