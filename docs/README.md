# 介绍

## Steer

一个适用于中大型管理系统开发的设计方案

Steer， 意思是掌舵，如果把前端开发比喻作海上行驶的船，那么控制船行驶方向的是船舵，控制好了船舵，再大的船也是可以控制的，那么我们想要控制什么呢？控制的是交互的形式，统一的规范，统一的风格，逐渐沉淀属于自己的风格。

我们还有另一个愿景是随着组件，模版的沉淀，前端开发人员可以逐步减少重复的工作，逐步释放出来，去做更加有挑战性，有意义的事情，释放自己的创造力。

如何实现这样一个目标，我们的初步想法是需要实现如下几件事：

1. 通过业务梳理，逐步沉淀组件，通过组件的沉淀达到写页面不在需要样式，只需关注业务逻辑
2. 实现模版编辑器，嵌入当前项目中，支持模版实时预览和编辑
3. 梳理业务，沉淀业务代码模版，实现一键生成页面能力，随着不断的沉淀，布局的时间也省去了



## 组件

 该项目中基于antd，进行二次封装实现了部分易用快捷的组件，编写一个通用的增删改查页面，页面已经无需再关心样式，前端的代码形如：

```react
function Crud() {
  return (
    <Page>
      <Page.Header
        title=""
        actions={
          <Actions>
            <Actions.Action type="text">Text</Actions.Action>
            <Actions.Action type="link">Link</Actions.Action>
            <Actions.Action>次按钮</Actions.Action>
            <Actions.Action type="primary">主按钮</Actions.Action>
          </Actions>
        }
       >
        <Filter
          actions={
            <Actions>
              <Actions.Action type="primary">创建</Actions.Action>
              <Actions.Action>按钮</Actions.Action>
            </Actions>
          }
         >
          <Filter.Item name="name"><Input /></Filter.Item>
          <Filter.Item name="date"><DatePicker.RangePicker /></Filter.Item>
          <Filter.Item name="gener"><Select /></Filter.Item>
        </Filter>
      </Page.Header>
      <Page.Sider>
        <!-- 侧边栏 -->
      	<Tree />
      </Page.Sider>
      <Table
      	actions={
          <Actions size="small">
            <Actions.Action>编辑</Actions.Action>
            <Actions.Action>查看</Actions.Action>
            <Actions.Action danger>删除</Actions.Action>
          </Actions>
        }  
      >
        <Table.Column></Table.Column>
        <Table.Column></Table.Column>
        <Table.ColumnGroup>
          <Table.Column></Table.Column>
        	<Table.Column></Table.Column>
        </Table.ColumnGroup>
      </Table>
      <!-- 其他页面内容 -->
      <Page.Footer></Page.Footer>
    </Page>
  )
}
```

通过组件的封装，实现页面布局变得如此简单，当然这上面中的任意组件节点，不需要展示时移除对应节点即可，如：Page.Footer，Page.Header，Page.Sider或者是Actions

这样一个结构是符合人性化的，仅仅通过代码，可以快速知道，这个页面长什么样，对于界面元素一目了然，并且即使是不同水平的开发人员，使用这样的组件，最终的交互形式始终一致，它最终输出的界面如下:

![image-20200912200232409](images/image-20200912200232409.png)

本项目中集成了部分常用组件，更多详情查看[组件文档](COMPONENT/README.md)



## 模版

解决了布局问题，如何解决那些不断重复的通用业务逻辑呢，就拿上面的增删改查页面来说，布局组件只是解决了界面的搭建，除此之外还有许多的逻辑需要我们不断的编写，如完整的创建流程如下，点击创建按钮，输入表单值，提交表单，发起请求，失败时提示错误信息，成功时提示成功并关闭弹窗同时刷新列表，这样的流程非常的多并且重复，我们需要不断的去关注和细化它

然而通过模版代码这就变得简单，通过简单的模版参数配置，即可一键获取这些逻辑，我们要做的只是不断提炼这些逻辑，规范它，使其清晰易懂，当绝大部分页面实现模版化之后，代码的规范性，一致性得以实现，整体的项目变得就像一个人写的一样

那么模版代码做不了什么呢？同一个增删改查在不同的业务中，会存在些许的差异，比如表单项需要那些字段，表格显示哪些字段，以什么样的格式去做，虽然这些可以通过细化模版参数来达到用户可配置的状态，但这不是我们想要的，对于开发人员这样专业领域来说，界面的细化配置远不如直接对代码的编写，我们认为模版需要完成的仅仅是页面的布局及该场景下通用业务逻辑，如页面是否需要筛选，表格是否需要分页，是否需要`增``删``改``查`等动作即可，因为这些动作会对应生成不同的弹窗及交互逻辑，然而对于表格要显示哪些列，表单需要修改哪些字段，我们只需要在模版中列出大部分的不同类型模块即可，为的就是开发者可以在少查看或者不查看文档的情况下，快速找到代码参考，完成细节的编写

对于模版编写及模版编辑器的编写查看[模版代码编辑器文档](EDITOR/README.md)

## 状态管理

为什么想要统一状态管理，为了让我们在页面组件中能一眼看出整个页面包含了哪些组件，我们希望借助redux的状态管理，减少组件之间的状态传递，同时利用zoro便捷redux库抽离业务逻辑到独立的model中，方便模版生成后快速的针对性修改

```react
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

```

如上面页面所展示给我的信息，我们可以快速知道这个页面包含树形筛选，筛选器，表格，创建弹窗，编辑弹窗，查看弹窗，当我们需要修改逻辑时可以快速找到对应组件，进行修改即可

本项目集成了数据状态管理库[ZORO使用文档](https://faurewu.github.io/zoro/)，更多关于状态管理的文档查看[开发文档](DEVELOPMENT/README.md)

了解了项目的思想，如果你还有兴趣深入了解及使用，继续查看下面的文档吧[安装](INSTALL.md)