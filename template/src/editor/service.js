import request from '@/utils/request'

const editorApis = {
  getTemplates: '/templates',
  createPreviewPage: '/preview',
  createPage: '/create',
}

const apis = {
  query: '/crud/query',
  create: '/crud/create',
  edit: '/crud/edit',
  delete: '/crud/delete',
  detail: '/crud/detail',
  tree: '/crud/tree',
}

const prefix = process.env.REACT_APP_ENV === 'mock' ? process.env.REACT_APP_API_PREFIX : '/mock'

const editorService = Object.keys(editorApis).reduce(
  (_, key) => ({
    ..._,
    [key]: `${window.location.origin}${prefix}${process.env.REACT_APP_TEMPLATE_EDITOR_ROUTE}${editorApis[key]}`,
  }),
  {},
)

const service = Object.keys(apis).reduce(
  (_, key) => ({
    ..._,
    [key]: `${window.location.origin}${prefix}${apis[key]}`
  }),
  {},
)

export async function getEditorTemplates() {
  const { data = [] } = await request(editorService.getTemplates, {
    method: 'GET',
  })

  return data
}

export async function previewPage({ template, value }) {
  const { data } = await request(editorService.createPreviewPage, {
    method: 'POST',
    data: {
      template,
      value,
    },
  })

  return data
}

export async function createPage({ template, path, value }) {
  const { data } = await request(editorService.createPage, {
    method: 'POST',
    data: { template, value, path },
  })

  return data
}

/**
 * 获取表格数据
 */
export async function crudQuery(params) {
  const response = await request(service.query, {
    method: 'GET',
    data: params,
  })

  return response
}

/**
 * 创建表格项
 */
export async function crudCreate(params) {
  const response = await request(service.create, {
    method: 'POST',
    data: params,
  })

  return response
}

/**
 * 编辑表格项
 */
export async function crudEdit(params) {
  const response = await request(service.edit, {
    method: 'POST',
    data: params,
  })

  return response
}

/**
 * 删除表格项
 */
export async function curdDelete(params) {
  const response = await request(service.delete, {
    method: 'DELETE',
    data: params,
  })

  return response
}

/**
 * 获取表格项详情
 */
export async function crudDetail(params) {
  const response = await request(service.detail, {
    method: 'GET',
    data: params,
  })

  return response
}

/**
 * 获取表格筛选树
 */
export async function crudTree(params) {
  const response = await request(service.tree, {
    method: 'GET',
    data: params,
  })

  return response
}
