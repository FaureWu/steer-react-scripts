# 状态管理

该项目基于[zoro状态管理库](https://faurewu.github.io/zoro/)，这里主要不是介绍如何使用zoro，如果对于zoro的使用有疑问可以直接查看对应的[zoro文档](https://faurewu.github.io/zoro/)

在项目中，我们将model区分为全局models及页面models，对于全局model，放置于`src/models`文件夹中，便可自动注入到项目中，而对于页面级别的model放置于对应页面的models文件夹中

之所以引入model是希望能做到界面和数据分离的能力，局部使用hook做状态管理，利用redux封装的上层model分离业务层，这本身不存在冲突，一个简单的使用如下

```react
import { dispatcher } from '@opcjs/zoro'
import { useModel } from 'steer'

function Com() {
  // 通过useModel获取model的状态
  const user = useModel(({ user }) => user)
  
  function handleLogin() {
    dispatcher.user.login()
  }
  
  return (
    <div>
      <div>用户名: {user.userName}</div>
      <button onClick={handleLogin}>登录</button>
    </div>
  )
}
```

***loading状态管理***

项目中引入了zoro loading插件，可以通过如下获取

```react
import { useModel } from 'steer'

function Com() {
  const loading = useModel(({ loading }) => ({
    login: loading.effect['user/login'],
  }))
  
  return (
    <div>
      {loading.login ? <div>正在登录中...</div> : <div>已登录</div>}
    </div>
  )
}
```

loading插件的更多使用方式，请查看[Loading插件的使用](https://faurewu.github.io/zoro/PLUGIN/LOADING.html)

