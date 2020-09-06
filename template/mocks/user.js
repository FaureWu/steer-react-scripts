import faker from 'faker'

function createUser() {
  return {
    userId: faker.random.uuid(),
    userName: faker.name.findName(),
  };
}

export default {
  'POST /user/login': {
    code: 200,
    message: 'error',
    data: faker.random.uuid(),
  },

  'GET /user/info': {
    code: 200,
    message: '',
    data: createUser(),
  },

  'GET /user/auth': {
    code: 200,
    message: '',
    data: [
      {
        name: '首页',
        path: '/',
        children: [
          {
            name: '获取用户信息',
            path: '/user/info',
          },
        ],
      },
    ],
  },
}
