# 组件

项目组件基于Antd封装，所有的antd组件都可以使用，同时antd中以dayjs替换了moment，减少包的大小，以及antd的主题配置通过`src/theme.less`进行配置

项目中二次封装了一些常用组件，固化交互，逐步减少页面开发时间，同时也是希望项目使用者能遵循该思想，逐步提炼，固化组件，形成自己的独特交互风格，让组件的使用者无需在关心其交互模式

现有的组件如下

* [Page](COMPONENT/PAGE.md) 页面布局组件，同时开启了页面切换动画
* [Table](COMPONENT/TABLE.md) 表格组件
* [Form](COMPONENT/FORM.md) 表单组件
* [Filter](COMPONENT/FILTER.md) 筛选组件
* [Modal](COMPONENT/MODAL.md) 弹窗组件
* [Tree](COMPONENT/TREE.md) 树形组件
* [View](COMPONENT/VIEW.md) 查看组件
* [Actions](COMPONENT/ACTIONS.md) 操作组组件，可用于Page, Table, Form, Filter, Modal, View组件中