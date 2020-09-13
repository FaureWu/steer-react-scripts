# 动态布局

本项目的布局亮点主要在于`动态`两字，现在大部分的现有框架，对于布局的设计往往是基于编译时，无法在线切换，对于复杂的适配场景难以应付，比如我们的系统不仅需要独立部署，还要嵌入第三方系统，对于嵌入第三方系统的界面，我们是不需要菜单栏的，动态布局可以很好的适配这些场景，一次编译，多场景通用

我们约定`src/layouts`目录下第一级脚本文件为布局文件，项目中已编写了两种布局，分别是`vertical`水平布局，`horizontal`垂直布局

切换布局的方式如下:

```
http://localhost:3000/horizontal#/ 垂直布局模式
http://localhost:3000/vertical#/ 水平布局模式
http://localhost:3000#/ 全屏模式，比如登录界面
```

布局的切换是支持运行时切换的，你可以在代码中动态切换布局，也可以通过修改路由地址达到使用不同布局的场景，你也可以编写更多的布局

布局组件开启了动态加载，通过`React Suspense`组件实现资源加载中的效果，该效果与Page页面的动态加载态保持一致，如果需要修改效果，直接修改`src/components/loading`组件即可

***布局切换***

```js
import { history } from 'steer'

history.switch('vertical', '/')
history.switch('horizontal', '/order')
history.switch(undefined, '/login')
```

