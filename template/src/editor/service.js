import request from '@/utils/request'

export async function getEditorTemplates() {
  const { data = [] } = await request('/editor/templates', {
    method: 'GET',
  })

  return data
}

export async function previewPage({ template }) {
  await request('/editor/preview', {
    method: 'POST',
    data: {
      template,
      path: `${process.env.REACT_APP_TEMPLATE_EDITOR_ROUTE}/preview`,
    },
  })
}

export async function createPage({ template, path, value }) {
  const { data } = await request('/editor/create', {
    method: 'POST',
    data: { template, value, path },
  })

  return data
}
