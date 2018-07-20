const db = require('../lib/mongodb');
const ObjectID = require('mongodb').ObjectID;
// const assert = require('assert');

const SongController = {};

// limit、keyword 、page、per_page、sortby、order
SongController.getSongList = async (ctx, next) => {
  let list = null;
  let res = null;
  let limitNum = 20; // 默认返回最大记录数
  try {
    if (JSON.stringify(ctx.query) !== '{}') {
      if (Object.prototype.hasOwnProperty.call(ctx.query, 'keyword')) {
        list = await db.c('song').find({"$or": [{name: { $regex: ctx.query.keyword }}, {singer: { $regex: ctx.query.keyword }}]}).limit(+ctx.query.limit || limitNum).toArray();
      } else {
        list = await db.c('song').find({}).limit(+ctx.query.limit || limitNum).sort({clickCount: -1}).toArray();
      }
    } else {
      list = await db.c('song').find({}).limit(limitNum).sort({clickCount: -1}).toArray();
    }
    res = {
      code: 200,
      data: list
    };
  } catch (err) {
    res = {
      code: 999,
      error: err.toString()
    };
  }
  ctx.body = res;
}

SongController.getSongDetail = async function (ctx, next) {
  let obj = null;
  let res = null;
  try {
    obj = await db.c('song').find({_id: ObjectID(ctx.params.id)}).toArray();
    res = {
      code: 200,
      data: obj
    };
    // 增加点击量
    db.c('song').updateOne({_id: ObjectID(ctx.params.id)}, {$set: {clickCount : obj[0].clickCount + 1}})
  } catch (err) {
    res = {
      code: 999,
      error: err.toString()
    };
  }
  ctx.body = res;

}

module.exports = SongController;