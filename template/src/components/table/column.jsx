import React from 'react'
import { Table } from 'antd'

function Column({ width = 100, ...props }) {
  return <Table.Column {...props} width={width} />
}

export default Column
