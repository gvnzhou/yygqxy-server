const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Config = require('./config');
const router = require('./routes/index');
const mongodb = require('./lib/mongodb');

mongodb.createConnection(Config.MongoDB.host + ':' + Config.MongoDB.port);

const app = new Koa();

app.use(bodyParser());

app.use(router.routes(), router.allowedMethods())

app.listen(Config.Server.port, () => {
  console.warn('Server is running. Listening at ' + Config.Server.port + '...');
});