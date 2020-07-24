import faker from 'faker';

export default {
  'GET /demo': {
    code: 200,
    message: '获取',
    data: {},
  },
  'POST /demo/add': (req, res) => {
    req.status(200).json({
      code: 200,
      message: '添加',
      data: faker.name.findName(),
    })
  },
}