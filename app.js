const Koa = require('koa');
const router = require('./routes/index');
const bodyParser = require('koa-bodyparser');

const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    port: 5000
  },
  production: {
    port: 5000
  }
};

const app = new Koa();

app.use(bodyParser());

app.use(router.routes(), router.allowedMethods())

app.listen(config[env].port, () => {

  console.warn('Server is running. Listening at ' + config[env].port + '...');
});