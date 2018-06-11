const env = 'development';
const Config = {
  development: {
    Server: {
      host: '127.0.0.1',
      port: 5000
    },
    MongoDB: {
      host: 'localhost',
      port: '27017',
      dbName: 'yygqxy',
      username: 'admin',
      password: 'zij121xc'
    }
  },
  production: {
    Server: {
      host: '127.0.0.1',
      port: 5000
    },
    MongoDB: {
      host: '127.0.0.1',
      port: '27017',
      dbName: 'yygqxy'
    }
  }
};

module.exports = Config[env];