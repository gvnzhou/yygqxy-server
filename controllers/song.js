// const errorMsg = require('../core/errorMsg');
// const model = require('../models/model');
// const md5 = require('js-md5');
const db = require('../lib/mongodb');
const assert = require('assert');

const SongController = {};

SongController.getSongList = async (ctx, next) => {
  let list = null;
  let res = null;
  try {
    if (JSON.stringify(ctx.query) !== '{}') {
      if (Object.prototype.hasOwnProperty.call(ctx.query, 'limit')) {
        list = await db.c('song').find().limit(+ctx.query.limit).toArray();
      } else {
        list = await db.c('song').find().toArray();
      }
    }
    res = {
      code: '0000',
      message: 'success',
      data: list
    };
  } catch (err) {
    res = {
      code: '9999',
      message: 'error',
      data: err.toString()
    };
  }
  ctx.body = res;
}

SongController.getSongDetail = async function (ctx) {
  const regType = ctx.request.body.regType;
  

}

module.exports = SongController;