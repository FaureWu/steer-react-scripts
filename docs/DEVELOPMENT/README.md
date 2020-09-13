# 开发

本脚手架基于[create-react-app](https://create-react-app.dev/)定制化改造而来，基本保留了绝大部分create-react-app能力，基于此我们定制实现了约定式路由，布局能力，Model，Plugin动态自动注入，高度提炼的组件，模版等能力



## 目录结构

```
.
+-- mocks                               			// 本地mock数据
+-- public
+-- src
|   +-- .steer																// development环境下自动生成的目录，不可改动
|   +-- .steer-pro														// production环境下自动生成的目录，不可改动
|   +-- assets																// 图片资源存放目录
|   +-- components														// 全局组件存放目录
|   +-- config																// 项目配置存放目录
|   +-- editor																// 编辑器，模版代码所在目录
|   +-- layouts																// 布局文件所在目录
|   +-- models																// 全局model所在目录
|   +-- pages																	// 页面存放目录
|   +-- plugins																// 全局zoro plugin存放目录
|   +-- services															// 接口服务存放目录
|   +-- utils																	// 工具类存放目录
|   		+-- hook.js														// react hook工具
|   		+-- request.js												// 请求工具
|   		+-- tool.js														// 通用工具
|   		+-- type.js														// 类型定义工具
|   +-- app.js																// 入口文件
|   +-- app.less															// 全局样式
|   +-- serviceWorker.js
|   +-- theme.less														// 全局主题变量配置，同时也可用于自定义antd主题
|   +-- .env
|   +-- .env.mock
|   +-- .env.dev
|   +-- .env.prod
```



## 项目启动

***本地mock开发环境启动***

用于连接本地MOCK环境进行开发调试

```bash
$ npm run mock
# 或者
$ yarn mock
```

该命令会在webpack dev-server服务中自动注入`mocks`目录下的所有mock服务，详情查看[Mock文档](DEVELOPMENT/MOCK.md)，同时该命令会注入`.env` `.env.mock`中注册的环境变量，更多变量解释查看[ENV环境变量](DEVELOPMENT/ENV.md)

***本地开发环境启动***

用于连接开发环境服务器进行开发调试

```bash
$ npm run dev
# 或者
$ yarn dev
```

该命令会连接开发环境服务器接口，同时注入`.env` `.env.dev`中注册的环境变量，如开发环境服务器地址`REACT_APP_SERVER`，更多变量解释查看[ENV环境变量](DEVELOPMENT/ENV.md)

***本地线上环境启动***

用于连接线上环境服务器进行开发调试，时常用于线上问题快速定位

```bash
$ npm run prod
# 或者
$ yarn prod
```

该命令会连接线上服务器接口，同时注入`.env` `.env.prod`中注册的环境变量，如线上环境服务器地址`REACT_APP_SERVER`，更多变量解释查看[ENV环境变量](DEVELOPMENT/ENV.md)



## 项目打包

***开发环境打包***

打包开发环境包，用于发布到开发服务器中

```bash
$ npm run build:dev
# 或者
$ yarn build:dev
```

***线上环境打包***

打包线上环境包，用于发布到线上服务器中

```bash
$ npm run build
# 或者
$ yarn build
```



##  包大小分析

```bash
$ npm run analyze
# 或者
$ yarn analyze
```

用于分析包结构，做对应的包大小优化



下一篇文档[快速开始](DEVELOPMENT/GUIDE.md)

