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
