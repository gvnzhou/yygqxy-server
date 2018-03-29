const Koa = require('koa');
const router = require('./routes/index');
const bodyParser = require('koa-bodyparser');

const config = require('./config/config');

const app = new Koa();

app.use(bodyParser());

app.use(router.routes(), router.allowedMethods())

app.listen(config.port, () => {
  console.log(config);
  console.warn('MiaowServer is running.');
});