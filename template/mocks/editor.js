/**
 * 本文件用于代码模版编辑器服务
 * 请勿删除，否则编辑器功能将无法使用
 */

import faker from 'faker'

function createUser() {
  return {
    id: faker.random.uuid(),
    name: faker.name.findName(),
    age: faker.random.number({ min: 10, max: 100 }),
    gender: faker.random.arrayElement(['man', 'woman']),
    birthday: new Date(),
    address: faker.random.words(5),
    intro: faker.random.words(50),
  }
}

function createCity({ currentLevel, maxLevel }) {
  const key = faker.random.uuid();
  return {
    key,
    title: faker.name.findName(),
    children:
      currentLevel === maxLevel
        ? []
        : Array.from({ length: 5 }).map(() =>
            createCity({ currentLevel: currentLevel + 1, maxLevel }),
          ),
  };
}

function crudQuery(req, res) {
  const { current, pageSize } = req.query;

  if (!current) {
    return res.status(200).json({
      code: 200,
      data: Array.from({ length: 50 }).map(createUser),
    })
  }

  const list = Array.from({ length: 50 }).map(createUser);

  const count = parseInt(pageSize);
  const pos = parseInt(current);
  const data = list.slice(count * (pos - 1), count * (pos - 1) + count);

  res.status(200).json({
    code: 200,
    total: list.length,
    data,
  });
}

function crudTree(req, res) {
  res.status(200).json({
    code: 200,
    data: Array.from({ length: 10 }).map(() => createCity({ currentLevel: 0, maxLevel: 3 })),
  })
}

export default {
  'GET /crud/query': crudQuery,
  'POST /crud/create': {
    code: 200,
    data: createUser(),
  },
  'POST /crud/edit': {
    code: 200,
    data: createUser(),
  },
  'GET /crud/detail': {
    code: 200,
    data: {
      ...createUser(),
      list: Array.from({ length: 10 }).map(createUser),
    },
  },
  'DELETE /crud/delete': {
    code: 200,
  },
  'GET /crud/tree': crudTree,
}
