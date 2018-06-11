const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Config = require('./config');
const router = require('./routes/index');
const mongodb = require('./lib/mongodb');

// mongodb.createConnection('mongodb://' + Config.MongoDB.username + ':' + Config.MongoDB.password + '@' + Config.MongoDB.host + ':' + Config.MongoDB.port);
mongodb.createConnection('mongodb://' + Config.MongoDB.host + ':' + Config.MongoDB.port);

const app = new Koa();

app.use(bodyParser());

app.use(router.routes(), router.allowedMethods())

app.use(async (ctx, next) => {
  try {
    await next()
    if (ctx.status === 404) {
      // do somthing here
      ctx.body = {
        error: "The request url is error"
      }
    }
  } catch (err) {
    // handle error
  }
})

app.listen(Config.Server.port, () => {
  console.warn('Server is running. Listening at ' + Config.Server.port + '...');
});