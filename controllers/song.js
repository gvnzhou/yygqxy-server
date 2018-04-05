// const errorMsg = require('../core/errorMsg');
// const model = require('../models/model');
// const md5 = require('js-md5');
const db = require('../lib/mongodb');
const assert = require('assert');

const SongController = {};

SongController.getSongList = async (ctx, next) => {
	try {
		let list = await db.c('song').find().limit(3).toArray();
		let res = {
			code: '0000',
			message: 'success',
			data: list
		};
		ctx.body = res;		
		
	} catch (err) {
			let res = {
					code: '9999',
					message: 'error',
					data: err
			};
			ctx.body = res;
	}
}

SongController.getSongDetail = async function (ctx) {
	const regType = ctx.request.body.regType;
	
}

module.exports = SongController;