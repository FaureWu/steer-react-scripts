import React, { useMemo } from 'react'
import Page from '@/components/page/page'

import Filter from './components/filter/filter'
import Tree from './components/tree/tree'
import Create from './components/operator/create'
import Edit from './components/operator/edit'
import View from './components/operator/view'
import Table from './components/table/table'

export default function () {
  return useMemo(() => {
    return (
      <Page>
        <Page.Sider>
          <Tree />
        </Page.Sider>
        <Filter />
        <Table />
        <Create />
        <Edit />
        <View />
      </Page>
    )
  }, [])
}
