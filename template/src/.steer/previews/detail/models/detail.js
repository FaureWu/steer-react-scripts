import { crudDetail } from '@/services/demo'

const defaultState = {
  data: {},
}

export default {
  namespace: 'detailDetail',

  mixins: ['update'],

  state: {
    ...defaultState,
  },

  effects: {
    async query({ payload }, { put }) {
      const { data = {} } = await crudDetail(payload)
      put({ type: 'update', payload: { data } })
    },
  },

  reducers: {
    clear(action, state) {
      return {
        ...state,
        ...defaultState,
      }
    },
  },
}
