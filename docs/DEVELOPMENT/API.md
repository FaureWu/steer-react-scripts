# API

## app

```js
import { app } from 'steer'
```

获取zoro的app对象，一般情况下不需要获取使用，大部分zoro的能力已通过约定及配置实现

## store

```js
import { store } from 'steer'
```

获取redux的store状态对象

## history

```js
import { history } from 'steer'

// 用于需要切换布局的路由跳转
history.switch('vertical', '/')
history.switch('horizontal', '/order')
history.switch(undefined, '/login')

// 用于同布局下的路由跳转
history.push('/')
history.replace('/')
history.go(-1)
history.back()
history.forward()
```

获取路由对象，用于路由控制，history的使用方式查看[history api](https://github.com/ReactTraining/history)

## useModel

```js
import { useModel } from 'steer'

function Com() {
  const model = useModel(state => state.model)
}
```

通过hook api获取redux的状态到组件或者页面中，用于代替connect的使用

## useQuery

```js
import { useQuery } from 'steer'

function Page() {
  const params = useQuery()
}
```

用于在页面中或者在组件中获取路由参数