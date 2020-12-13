let data = {
  pages: [],
  layouts: [],
  models: [],
  plugins: [],
}

function getData() {
  return { ...data }
}

function setData(params) {
  data = {
    ...data,
    ...params,
  }
}

function addPage(page) {
  data.pages.push(page)
}

function getPageNamesMap(pages) {
  return pages.reduce(
    (result, page) => ({
      ...result,
      [page.name]: page,
    }),
    {},
  )
}

function updatePages(pages) {
  const pageNamesMap = getPageNamesMap(pages)

  data.pages = data.pages.map((page) => {
    const newPage = pageNamesMap[page.name]

    return newPage || page
  })
}

function removePage(page) {
  data.pages = data.pages.filter((item) => item.name !== page.name)
}

function addModel(model) {
  data.models.push(model)
}

function updateModels(models) {
  data.models = models
}

function addPlugin(plugin) {
  data.plugins.push(plugin)
}

function updatePlugins(plugins) {
  data.plugins = plugins
}

function addLayout(layout) {
  data.layouts.push(layout)
}

module.exports = {
  getData,
  setData,
  addPage,
  updatePages,
  removePage,
  addModel,
  updateModels,
  addPlugin,
  updatePlugins,
  addLayout,
}
