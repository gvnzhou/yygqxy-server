// const errorMsg = require('../core/errorMsg');
// const model = require('../models/model');
// const md5 = require('js-md5');
const db = require('../lib/mongodb');
const assert = require('assert');

const SongController = {};

SongController.getSongList = async function (ctx, next) {
	
	// 查询数据库 获取数据
	
	// const regType = ctx.request.body.regType;
	// ctx.body = await db.c('song');
	const res = await db.c('song').find({}).limit(3);
	ctx.body = res.toString();
}

SongController.getSongDetail = async function (ctx) {
	const regType = ctx.request.body.regType;
	
}

module.exports = SongController;