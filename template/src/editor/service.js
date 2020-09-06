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
