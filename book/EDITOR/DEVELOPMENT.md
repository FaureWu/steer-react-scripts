# 创建模版代码

模版代码是基于页面级别的代码模版管理，模版代码统一放置于`src/editor/templates`中，templates目录下的一个文件夹对应一个页面模版代码，一个完整的模版代码应该包含以下两个文件

```
template																				// 模版代码名称
+-- config.json																	// 模版代码配置文件
+-- index.jsx.ejs																// 模版代码入口文件，与config.json中的entry相对应
```

一个模版代码的完整配置如下

```json
{
  "title": "模版名称",
  "entry": "index.jsx",									// 模版代码入口文件，省略.ejs后缀，入口文件就是页面的入口
  "value": {
    "components": {
      "filter": true
    },
    "table": {
      "pagination": true,
      "operators": ["create", "edit", "view", "delete"]
    },
    "filter": {
      "allowReset": true
    },
    "title": "页面标题"
  },													// 模版的预览参数值，用于模版初始化及预览
  "config": {
    "components": {
      "type": "group",
      "label": "页面组件配置",
      "config": {
        "filter": {
          "type": "checkbox",
          "defaultValue": true,
          "label": "是否开启筛选"
        }
      }
    },
    "table": {
      "type": "group",
      "label": "表格配置",
      "config": {
        "pagination": {
          "type": "checkbox",
          "defaultValue": true,
          "label": "是否开启分页"
        },
        "operators": {
          "type": "checkboxGroup",
          "label": "表格操作",
          "defaultValue": ["create", "edit", "view", "delete"]
        }
      }
    },
    "filter": {
      "type": "group",
      "label": "筛选配置",
      "dependencies": ["components.filter"],
      "config": {
        "allowReset": {
          "type": "checkbox",
          "defaultValue": true,
          "label": "是否开启分页"
        }
      }
    },
    "title": {
      "type": "input",
      "defaultValue": "",
      "label": "页面标题"
    }
  },													// 模版参数配置
}
```

***模版配置***

模版配置的通用字段

```json
{
  "type": "",									// checkbox,checkboxGroup,radio,input,select,multiSelect,group
  "defaultValue": "", 				// 多值时数组
  "dependencies": [
    "components.filter",
    "table.operators.create"
  ],													// 配置项的依赖项，不设置依赖时，默认展示该项，当设置了依赖时，只有当依赖项为真时该项才显示
  "label": "",								// 模版配置项名称
}
```

***group***

```json
{
  "type": "group",
  "label": "模版配置分组",
  "config": {}								// 支持除了自身类型以外的所有配置类型
}
```

***checkbox***

```json
{
  "type": "checkbox",
  "defaultValue": true,
  "label": "单项选择项"
}
```

***checkboxGroup***

```json
{
  "type": "checkboxGroup",
  "defaultValue": [],
  "label": "多项选择"，
  "options": [{
    "label": "创建",
    "value": "create"
  }, {
    "label": "编辑",
    "value": "edit"
  }, {
    "label": "查看",
    "value": "view"
  }, {
    "label": "删除",
    "value": "delete"
  }]
}
```

***radio***

```json
{
  "type": "radio",
	"defaultValue": "option1",
  "label": "单项选择",
  "options": [{
    "label": "选项1",
    "value": "option1"
  }, {
    "label": "选项2",
    "value": "option2"
  }]
}
```

***input***

```json
{
  "type": "input",
  "defaultValue": "",
  "label": "输入框选项"
}
```

***select***

```json
{
  "type": "select",
	"defaultValue": "option1",
  "label": "下拉单选",
  "options": [{
    "label": "选项1",
    "value": "option1"
  }, {
    "label": "选项2",
    "value": "option2"
  }]
}
```

***multiSelect***

```json
{
  "type": "multiSelect",
	"defaultValue": ["option1"],
  "label": "下拉多选",
  "options": [{
    "label": "选项1",
    "value": "option1"
  }, {
    "label": "选项2",
    "value": "option2"
  }]
}
```

以上就是模版参数定义



## 模版编写

模版的编写基于ejs模版语法，编辑器默认会注入两个变量`name` `data`到模版中，可直接在模版中使用

* name 页面的名称
* data 用户选择的模版参数值，形如`config.json`中定义的value

```ejs
<%= name %>
<%= data.components.filter %>
```

ejs模版语法使用，请查看[EJS模版](https://ejs.bootcss.com/)，或者参考项目中现有的模版代码

***如何根据模版参数控制是否输出文件呢***

我们的模版代码很多时候需要控制某些文件条件性的输入，比如增删改查模版中，当用户没有勾选编辑功能时，编辑的弹窗是不需要生成的，而编辑弹窗是独立的文件，这时候我们只需按下面方式使用即可

```ejs
<% if (data.table.operators.edit) { -%>

...编辑的模版代码

<% } -%>
```

当使用`-%>`这个语法时，如果`data.table.operators.edit`为false时，模版输出的内容是不含空格，不含空行的，这个输出的内容就为空了，当编辑器检测到模版文件输出内容为空时，便不会创建文件，如果遇到文件夹为空时也不会创建文件夹

***模版编写实时预览***

通过访问模版编辑器中的预览功能跳转到对应模版预览界面，当我们的模版修改时，会自动更新预览界面，方便开发者快速开发调试模版代码



下一篇文档[自定义模版编辑器](EDITOR/CUSTOM.md)