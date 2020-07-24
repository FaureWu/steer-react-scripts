import { createMixin } from '@opcjs/zoro'

const update = {
  namespace: 'update',
  state: {},
  reducers: {
    update({ payload }, state) {
      return { ...state, ...payload }
    },
  },
}

export default [
  createMixin(update),
]
