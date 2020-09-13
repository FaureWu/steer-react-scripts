# 约定式路由

路由模式目前仅支持hash模式，基于[react-router](https://reactrouter.com/web/guides/quick-start)实现

项目中的`pages`目录结构即路由结构，如下目录结构对应的路由：

```
pages/login -> /login
pages/order/index -> /order
pages/order/detail -> /order/detail
```

本项目开启了动态路由功能，基于页面级别的动态加载，通过`React Suspense`组件实现资源加载中的效果，该效果与Layout布局的动态加载态保持一致，如果需要修改效果，直接修改`src/components/loading`组件即可

***路由参数***

```
/order/detail?id=123
```

获取参数的方式如下:

```js
import { useQuery } from 'steer'

function Page() {
  const params = useQuery()
  console.log(params.id)
}
```

***路由跳转***

```js
import { history } from 'steer'

history.push('/')
history.replace('/')
history.go(-1)
history.back()
history.forward()
```

更多history的使用方式，查看[history api](https://github.com/ReactTraining/history)，更多全局暴露的API，查看[全局API](DEVELOPMENT/API.md)

***忽略路由目录***

```bash
# .env
EXCLUDE_ROUTE_PATH=models,components
```

通过配置`.env`进行环境配置，被忽略的目录不会自动生成路由页面，更多环境配置查看[环境配置](DEVELOPMENT/ENV.md)

***页面Model***

我们约定页面目录下的`models`目录为页面数据模型，只有当页面第一次挂载时会注入相应的models，此时便可以正常使用，对于model的编写，这里不在说明，直接查看[ZORO MODEL](https://faurewu.github.io/zoro/API/MODEL.html)



下一篇文档[状态管理](DEVELOPMENT/MODEL.md)