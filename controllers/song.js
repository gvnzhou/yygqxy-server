// const errorMsg = require('../core/errorMsg');
// const model = require('../models/model');
// const md5 = require('js-md5');
const db = require('../lib/mongodb');
const assert = require('assert');

const SongController = {};

// limit、keyword 、page、per_page、sortby、order
SongController.getSongList = async (ctx, next) => {
  let list = null;
  let res = null;
  let limitNum = 20; // 默认返回最大记录数
  try {
    if (JSON.stringify(ctx.query) !== '{}') {
      if (Object.prototype.hasOwnProperty.call(ctx.query, 'keyword')) {
        list = await db.c('song').find({name: { $regex: ctx.query.keyword }}).limit(+ctx.query.limit || limitNum).toArray();
      } else {
        list = await db.c('song').find({}).limit(+ctx.query.limit || limitNum).toArray();
      }
    } else {
      list = await db.c('song').find({}).limit(limitNum).toArray();
    }
    res = {
      code: '200',
      data: list
    };
  } catch (err) {
    res = {
      code: '999',
      error: err.toString()
    };
  }
  ctx.body = res;
}

SongController.getSongDetail = async function (ctx) {
  const regType = ctx.request.body.regType;
  

}

module.exports = SongController;