# 环境变量

目前项目集成了三种环境`mock` `dev` `prod`

| 环境变量                        | 描述                                                         | 默认值                                   |
| ------------------------------- | ------------------------------------------------------------ | ---------------------------------------- |
| EXTEND_ESLINT                   | 启用ESLINT配置文件                                           | true                                     |
| REACT_APP_ROOT_ELEMENT_ID       | 根节点id                                                     | root                                     |
| REACT_APP_LOCALE                | antd语言包，更多语言包配置查看https://ant.design/docs/react/i18n-cn | zh_CN                                    |
| EXCLUDE_ROUTE_PATH              | 忽略路由目录                                                 | models,components                        |
| HOST                            | dev服务器监听地址                                            | localhost                                |
| PORT                            | dev服务器监听端口                                            | 3000                                     |
| REACT_APP_API_PREFIX            | 接口地址的统一前缀                                           | mock环境下为/mock，其它环境为空          |
| REACT_APP_SERVER                | 接口服务器地址                                               |                                          |
| REACT_APP_OPEN_LAYOUT           | 服务启动时默认打开的布局                                     | 仅development环境下生效，默认值/vertical |
| REACT_APP_OPEN_PAGE             | 服务器启动时默认打开的页面地址                               | 仅development环境下生效，默认值''        |
| REACT_APP_EDITOR                | 开启模版代码编辑器功能                                       | 仅development环境下生效，默认值true      |
| REACT_APP_TEMPLATE_EDITOR_ROUTE | 模版代码编辑器的路由地址                                     | 仅development环境下生效，默认值/editor   |
| DELAY_TIME                      | mock服务接口的延迟时间                                       | 仅development环境下生效，默认值200       |

***自定义环境变量***

在`.env`文件中可以定义任意你自己的环境变量，唯一的规定时必须已`REACT_APP_`开头，这样的变量会被自动注入到项目中，在项目中使用如下：

```js
// 定义了自定义变量 REACT_APP_CUSTOM=custom

function Com() {
  return <div>{process.env.REACT_APP_CUSTOM}</div>
}
```

***环境变量优先级***

`.env.local` > `.env.dev`  `.env.mock`  `.env.prod` > `.env`

不同环境中的变量相对独立，比如.`env.mock`环境中定义的无法在`.env.dev`中使用

***如何自定义环境***

假如上面的几种环境无法满足需求，如何扩展环境，比如我们需要新增test环境

首先新增`.env.test`文件，然后定义变量

在`package.json` `scripts`中新增

```bash
"test": "cross-env REACT_APP_ENV=test react-scripts start",
"build:test": "cross-env REACT_APP_ENV=test react-scripts build"
```



更多的环境变量参考[Create React App 环境变量](https://www.html.cn/create-react-app/docs/adding-custom-environment-variables/)