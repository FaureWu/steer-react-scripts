import { createMixin } from '@opcjs/zoro-plugin'

const update = {
  namespace: 'update',
  state: {},
  reducers: {
    update({ payload }, state) {
      return { ...state, ...payload }
    },
  },
}

const PAGINATION = {
  current: 1,
  pageSize: 10,
  total: 0,
  pageSizeOptions: [10, 20, 50, 100],
  showSizeChanger: true,
  showTotal: (total) => `共${total}条`,
}

const pagination = {
  namespace: 'pagination',
  state: {
    pagination: {
      ...PAGINATION,
    },
  },
  reducers: {
    resetPagination(action, state) {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          current: 1,
        },
      }
    },
    updatePagination({ payload }, state) {
      const current = parseInt(
        payload.current || state.pagination.current || PAGINATION.current,
      )
      const pageSize = parseInt(
        payload.pageSize || state.pagination.pageSize || PAGINATION.pageSize,
      )
      const total = parseInt(
        payload.total || state.pagination.total || PAGINATION.total,
      )

      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...payload,
          current,
          pageSize,
          total,
        },
      }
    },
    clearPagination(action, state) {
      return {
        ...state,
        pagination: PAGINATION,
      }
    },
  },
}

export default [createMixin(update), createMixin(pagination)]
