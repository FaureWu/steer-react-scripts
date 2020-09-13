# 数据模拟

本项目基于webpack dev-server实现了一套mock机制，约定`src/mocks`目录为mock文件的存放目录，同时基于[faker](https://github.com/fzaninotto/Faker)做为数据生成工具，一个mock的定义方式如下：

```js
import faker from 'faker'

export default {
  'GET /user/info': {
    code: 200,
    data: {
      userName: faker.name.findName(),
    },
  },
  'POST /user/login': (req, res) => {
    res.status(200).json({
      code: 200,
      data: faker.random.uuid(),
    })
  },
}
```

