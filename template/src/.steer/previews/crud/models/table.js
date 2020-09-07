import React from 'react'
import { crudQuery, crudTree } from '@/editor/service'

const defaultState = {
  dataSource: [],
  treeData: [],
  activeTreeItem: {},
}

export default {
  namespace: 'crudTable',

  state: {
    filter: React.createRef(),
    ...defaultState,
  },

  mixins: ['update', 'pagination'],

  effects: {
    async search(action, { put }) {
      put({ type: 'resetPagination' })
      await put({ type: 'query' })
    },

    async change({ payload }, { put }) {
      put({ type: 'updatePagination', payload: payload.pagination })
      await put({ type: 'query' })
    },

    async query({ payload }, { put, select }) {
      const { filter, pagination, activeTreeItem } = select()

      const params = filter.current.getFieldsValue()
      params.activeTreeKey = activeTreeItem.key
      params.current = pagination.current
      params.pageSize = pagination.pageSize

      const { data = [], total = 0 } = await crudQuery(params)
      put({ type: 'updatePagination', payload: { total } })
      put({ type: 'update', payload: { dataSource: data } })
    },

    async queryTree(action, { put }) {
      const { data = [] } = await crudTree()
      put({ type: 'update', payload: { treeData: data } })
    },

    async selectTree({ payload }, { put }) {
      put({ type: 'update', payload: { activeTreeItem: payload } })
      put({ type: 'resetPagination' })
      await put({ type: 'query' })
    },

    clear(action, { put }) {
      put({ type: 'clearPagination' })
      put({ type: 'crudOperator/clear' })
      put({ type: 'update', payload: defaultState })
    },
  },

  reducers: {
    selectTree({ payload }, state) {
      return {
        ...state,
        activeTreeItem: payload,
      }
    },
  },
}
