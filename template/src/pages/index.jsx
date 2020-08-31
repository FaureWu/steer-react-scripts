import React, { useRef, useMemo, useCallback, useState } from 'react'
import { Input, DatePicker, Select, Tag } from 'antd'
import { CarryOutOutlined, FormOutlined } from '@ant-design/icons'
import Page from '@/components/page/page'
import Filter from '@/components/filter/filter'
import Table from '@/components/table/table'
import Actions from '@/components/actions/actions'
import Form from '@/components/form/form'
import Modal from '@/components/modal/modal'
import View from '@/components/view/view'
import Tree from '@/components/tree/tree'

function Index() {
  const filter = useRef(null)
  const [visible, setVisible] = useState(false)

  const renderActions = useCallback(() => {
    return (
      <Actions size="small">
        <Actions.Action onClick={() => setVisible(true)}>
          显示弹窗
        </Actions.Action>
        <Actions.Action onClick={() => console.log('add')}>添加</Actions.Action>
        <Actions.Action danger onClick={() => console.log('delete')}>
          删除
        </Actions.Action>
      </Actions>
    )
  }, [])

  return useMemo(
    () => (
      <Page>
        <Page.Sider>
          <Tree
            treeData={[
              {
                title: 'parent 1',
                key: '0-0',
                icon: <CarryOutOutlined />,
                children: [
                  {
                    title: 'parent 1-0',
                    key: '0-0-0',
                    icon: <CarryOutOutlined />,
                    children: [
                      {
                        title: 'leaf',
                        key: '0-0-0-0',
                        icon: <CarryOutOutlined />,
                      },
                      {
                        title: 'leaf',
                        key: '0-0-0-1',
                        icon: <CarryOutOutlined />,
                      },
                      {
                        title: 'leaf',
                        key: '0-0-0-2',
                        icon: <CarryOutOutlined />,
                      },
                    ],
                  },
                  {
                    title: 'parent 1-1',
                    key: '0-0-1',
                    icon: <CarryOutOutlined />,
                    children: [
                      {
                        title: 'leaf',
                        key: '0-0-1-0',
                        icon: <CarryOutOutlined />,
                      },
                    ],
                  },
                  {
                    title: 'parent 1-2',
                    key: '0-0-2',
                    icon: <CarryOutOutlined />,
                    children: [
                      {
                        title: 'leaf',
                        key: '0-0-2-0',
                        icon: <CarryOutOutlined />,
                      },
                      {
                        title: 'leaf',
                        key: '0-0-2-1',
                        icon: <CarryOutOutlined />,
                        switcherIcon: <FormOutlined />,
                      },
                    ],
                  },
                ],
              },
              {
                title: 'parent 2',
                key: '0-1',
                icon: <CarryOutOutlined />,
                children: [
                  {
                    title: 'parent 2-0',
                    key: '0-1-0',
                    icon: <CarryOutOutlined />,
                    children: [
                      {
                        title: 'leaf',
                        key: '0-1-0-0',
                        icon: <CarryOutOutlined />,
                      },
                      {
                        title: 'leaf',
                        key: '0-1-0-1',
                        icon: <CarryOutOutlined />,
                      },
                    ],
                  },
                ],
              },
            ]}
          />
        </Page.Sider>
        <Page.Header
          title="表格演示"
          description="描述信息"
          avatar={{
            src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4',
          }}
          tags={
            <>
              <Tag color="blue">Running</Tag>
              <Tag color="blue">Running</Tag>
              <Tag color="blue">Running</Tag>
              <Tag color="blue">Running</Tag>
            </>
          }
          actions={
            <Actions>
              <Actions.Action>创建</Actions.Action>
              <Actions.Action onClick={() => console.log('add')}>
                添加
              </Actions.Action>
              <Actions.Action danger onClick={() => console.log('delete')}>
                删除
              </Actions.Action>
            </Actions>
          }
          onBack={() => console.log('back')}
        >
          页头信息
        </Page.Header>
        <Filter
          ref={filter}
          initialValues={{
            city: 'chengdu',
          }}
          onSearch={(values) => console.log(values)}
          onFieldChange={(name, value) => {
            if (name === 'age') {
              filter.current.setData({ name: 'eee' })
            }
          }}
          actions={
            <Actions>
              <Actions.Action>创建</Actions.Action>
              <Actions.Action onClick={() => console.log('add')}>
                添加
              </Actions.Action>
              <Actions.Action danger onClick={() => console.log('delete')}>
                删除
              </Actions.Action>
            </Actions>
          }
        >
          <Filter.Item name="name" required>
            <Input placeholder="名称" />
          </Filter.Item>
          <Filter.Item name="age" trigger>
            <Input placeholder="年龄" />
          </Filter.Item>
          <Filter.Item name="date">
            <DatePicker />
          </Filter.Item>
          <Filter.Item name="city">
            <Select
              dropdownMatchSelectWidth={false}
              options={[
                { label: '成都', value: 'chengdu' },
                { label: '福建', value: 'fujian' },
              ]}
            />
          </Filter.Item>
          <Filter.Item name="dateRange">
            <DatePicker.RangePicker />
          </Filter.Item>
        </Filter>
        <Table
          rowKey="id"
          dataSource={[
            {
              id: 1,
              name: 'Faure',
              age: 29,
              address: '天府新区华阳协和下街',
            },
          ]}
        >
          <Table.Column title="姓名" dataIndex="name" />
          <Table.Column title="年龄" dataIndex="age" />
          <Table.Column title="地址" dataIndex="address" />
          <Table.Column
            title="操作"
            align="right"
            width={130}
            dataIndex="action"
            render={renderActions}
          />
        </Table>
        <View title="用户信息" loading>
          <View.Item label="用户名">Faure</View.Item>
          <View.Item label="城市">成都</View.Item>
          <View.Item label="年龄">29</View.Item>
          <View.Item label="地址">天府新区华阳协和下街</View.Item>
        </View>
        <Modal
          visible={visible}
          title="弹窗标题"
          closable={false}
          onCancel={() => setVisible(false)}
          actions={
            <Actions>
              <Actions.Action>创建</Actions.Action>
              <Actions.Action onClick={() => console.log('add')}>
                添加
              </Actions.Action>
              <Actions.Action danger onClick={() => console.log('delete')}>
                删除
              </Actions.Action>
            </Actions>
          }
        >
          <Form
            initialValues={{ user: { name: 'Faure', city: 'chengdu' } }}
            onSubmit={(values) => console.log(values)}
          >
            <Form.Group
              title="分组"
              actions={
                <Actions>
                  <Actions.Action>创建</Actions.Action>
                  <Actions.Action onClick={() => console.log('add')}>
                    添加
                  </Actions.Action>
                  <Actions.Action danger onClick={() => console.log('delete')}>
                    删除
                  </Actions.Action>
                </Actions>
              }
            >
              <Form.Item name={['user', 'name']} required label="名称">
                <Input />
              </Form.Item>
              <Form.Item name={['user', 'city']} label="城市">
                <Select
                  dropdownMatchSelectWidth={false}
                  options={[
                    { label: '成都', value: 'chengdu' },
                    { label: '福建', value: 'fujian' },
                  ]}
                />
              </Form.Item>
            </Form.Group>
            <Form.Item name="age" label="年龄" required>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Page>
    ),
    [renderActions, visible],
  )
}

export default Index
