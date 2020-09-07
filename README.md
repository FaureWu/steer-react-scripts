# steer-react-scripts

[![](https://img.shields.io/npm/v/steer-react-scripts.svg?style=flat-square)](https://npmjs.org/package/steer-react-scripts)
[![](https://img.shields.io/npm/dt/steer-react-scripts.svg?style=flat-square)](https://npmjs.org/package/steer-react-scripts)
[![](https://img.shields.io/npm/l/steer-react-scripts.svg?style=flat-square)](https://npmjs.org/package/steer-react-scripts)

> 本文档仅简单介绍项目基本能力，更多细节及使用方式请查看[文档还在建设中]()

<center>
  <img width="200" src="https://github.com/FaureWu/steer-react-scripts/blob/master/images/login.png" style="margin: 0 10px 0 0" /><img width="200" style="margin: 0 10px 0 0" src="https://github.com/FaureWu/steer-react-scripts/blob/master/images/home.png" /><img width="200" src="https://github.com/FaureWu/steer-react-scripts/blob/master/images/editor.png" />
</center>

该项目基于[create-react-app](https://create-react-app.dev/docs/getting-started/)脚手架改造而来，为了满足中后台快速开发需求
该项目集成了如下功能:

* 开箱即用
* 支持create-react-app绝大部分能力
* 约定式路由，无需关心路由注册
* 支持layout动态注册，应对不同场景需求
* 基于页面级别的路由分包加载
* 集成数据管理模块[zoro](https://faurewu.github.io/zoro/)，支持model自动注入
* 集成antd，封装常用组件，用于页面快速搭建
* 集成代码模版功能，一键快速生成模版页面
* 集成基本登录功能，通用布局，面包屑

## 模版代码功能

本项目支持模版代码编写，生成能力，通过在高速发展的业务过程中不断编写，沉淀业务代码模版，应对源源不断的业务来源，解放前端生产力，集中处理更为复杂的业务场景，同时模版代码能力也可以达到规范代码的作用，减少低级bug的产生

#### 项目中已经集成两个常用模版代码

* 增删改查模版

![增删改查模版](https://github.com/FaureWu/steer-react-scripts/blob/master/images/crud.png)

* 详情页模版

![详情页模版](https://github.com/FaureWu/steer-react-scripts/blob/master/images/detail.png)

一套模版通过不同参数设置，可以生成不同页面能力，你可以通过编写/修改模版来达到更加强大智能的模版，对于模版及编辑器能力都是开发者可以自行修改的及编写的，基本上可以满足你所需要的场景

## 如何快速创建项目

```bash
$ yarn create react-app your-app-name --scripts-version steer-react-scripts
```

## 安装应用依赖

```bash
$ cd your-app-name
$ yarn
```

## 如何启动项目

项目内置支持三种环境开发，`mock` `dev` `prod`

#### mock开发环境

```bash
$ yarn mock
```

默认会启动dev-server并注入mock服务，方便快速前后端分离开发

#### dev开发环境

```bash
$ yarn dev
```

#### prod开发环境

```bash
$ yarn prod
```

不同的环境主要用于连接不同的服务器地址进行调试

更多环境可通过自定义环境实现

## 如何打包项目

```bash
$ yarn build:dev
```

打包dev包

```bash
$ yarn build:prod
```

打包线上发布包

## 更新日志

[版本更新记录](https://github.com/FaureWu/zoro/releases)

## 开发交流

请添加微信 `Faure5` 备注 `steer` 咨询，开源不易，如果好用，欢迎star

<img src="https://img.baobeicang.com/user_upload/rc-upload-1539676937885-2.jpeg" width="150" />

## License

[MIT](https://tldrlegal.com/license/mit-license)