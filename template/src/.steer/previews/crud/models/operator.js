import React from 'react'
import { message } from 'antd'
import { crudDetail, crudCreate, crudEdit, curdDelete } from '@/services/demo'

const defaultState = {
  activeRow: {},
}

export default {
  namespace: 'crudOperator',

  state: {
    create: React.createRef(),
    edit: React.createRef(),
    view: React.createRef(),
    ...defaultState,
  },

  mixins: ['update'],

  effects: {
    create(action, { select }) {
      const { create } = select()
      create.current.show()
    },
    async createSubmit({ payload }, { select, put }) {
      const { create } = select()
      await crudCreate(payload)
      create.current.hide()
      message.success('创建成功')
      put({ type: 'crudTable/resetPagination' })
      put({ type: 'crudTable/query' })
    },

    async edit(action, { select, put }) {
      const { edit, activeRow } = select()
      edit.current.show()
      const { data = {} } = await crudDetail(activeRow)
      put({ type: 'update', payload: { activeRow: data } })
    },
    async editSubmit({ payload }, { select, put }) {
      const { edit } = select()
      await crudEdit(payload)
      edit.current.hide()
      message.success('编辑成功')
      put({ type: 'crudTable/query' })
    },

    async view(action, { select, put }) {
      const { view, activeRow } = select()
      view.current.show()
      const { data = {} } = await crudDetail(activeRow)
      put({ type: 'update', payload: { activeRow: data } })
    },

    async delete(action, { select, put }) {
      const { activeRow } = select()
      message.loading('删除中...', 0)
      await curdDelete(activeRow).finally(() => message.destroy())
      message.success('删除成功')
      put({ type: 'crudTable/query' })
    },
  },

  reducers: {
    setActiveRow({ payload }, state) {
      return {
        ...state,
        activeRow: payload,
      }
    },
    clear(action, state) {
      return {
        ...state,
        ...defaultState,
      }
    },
  },
}
