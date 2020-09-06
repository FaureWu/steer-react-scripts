import request from '@/utils/request'

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
