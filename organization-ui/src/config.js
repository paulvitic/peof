const env = process.env.NODE_ENV;

console.log('[info] running in ' + env + ' mode.' );

const dev = {
  app: {
    port: 3002
  },
  db: {
    host: '0.0.0.0',
    port: 27017,
    name: 'orgView',
    user: 'orgView',
    password: 'password'
  },
  queue: {
    host: '0.0.0.0',
    port: '5672'
  }
};

const test = {
  app: {
    port: 3002
  },
  db: {
    host: 'localhost',
    port: 27017,
    name: 'test',
    user: 'orgView',
    password: 'password'
  },
  queue: {
    host: '0.0.0.0',
    port: '5672'
  }
};

const prod = {
  app: {
    port: 3002
  },
  db: {
    host: 'peof_mongo_1',
    port: 27017,
    name: 'orgView',
    user: 'orgView',
    password: 'password'
  },
  queue: {
    host: 'peof_rabbitmq_1',
    port: '5672'
  }
};

const config = {
  dev,
  test,
  prod
};

export default config[env];