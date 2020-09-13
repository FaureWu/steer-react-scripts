#Page组件

Page组件用于定义页面布局

![image-20200913173843785](images/image-20200913173843785.png)

```react
import React from 'react'
import { Tag } from 'antd'
import Page from '@/components/page/page'
import Actions from '@/components/actions/actions'

export default function () {
  return (
    <Page>
      <Page.Header
        title="页面演示1"
        description="描述信息"
        avatar={{
          src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4',
        }}
        tags={<Tag color="blue">状态</Tag>}
        actions={
          <Actions>
            <Actions.Action>按钮1</Actions.Action>
            <Actions.Action>按钮2</Actions.Action>
            <Actions.Action>按钮3</Actions.Action>
          </Actions>
        }
        onBack={() => {}}
      >
        header
      </Page.Header>
      <Page.Sider>sider</Page.Sider>
      content
      <Page.Footer>footer</Page.Footer>
    </Page>
  )
}
```

***Page***

页面组件

| 属性        | 描述                 | 默认值 |
| ----------- | -------------------- | ------ |
| transparent | 控制背景是否透明     | false  |
| animation   | 是否开启页面过渡动画 | true   |

***Page.Header***

页头组件，只能放置于Page中

| 属性        | 描述                                                   | 默认值 |
| ----------- | ------------------------------------------------------ | ------ |
| title       | 页面标题                                               | 无     |
| description | 页面描述信息                                           | 无     |
| tags        | 页面状态，Antd Tag ｜Tag[]                             | 无     |
| avatar      | 头像，Antd Avatar props                                | 无     |
| actions     | 定义页面操作栏，[Actions组件](COMPONENT/ACTIONS)       | 无     |
| onBack      | 开启/关闭返回功能，也是点击返回的回调函数function() {} | 无     |

***Page.Sider***

页面侧边栏组件，仅能放置于Page中

***Page.Footer***

页面底部组件，仅能放置于Page中