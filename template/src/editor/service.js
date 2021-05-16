import request from '@/utils/request'

const editorApis = {
  getTemplates: '/templates',
  createPreviewPage: '/preview',
  createPage: '/create',
}

const prefix = process.env.REACT_APP_ENV === 'mock' ? process.env.REACT_APP_API_PREFIX : '/mock'

const editorService = Object.keys(editorApis).reduce(
  (_, key) => ({
    ..._,
    [key]: `${window.location.origin}${prefix}${process.env.REACT_APP_TEMPLATE_EDITOR_ROUTE}${editorApis[key]}`,
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
