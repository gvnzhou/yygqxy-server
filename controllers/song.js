// const errorMsg = require('../core/errorMsg');
// const model = require('../models/model');
// const md5 = require('js-md5');

const SongController = {};

SongController.getSongList = async function (ctx) {
	const regType = ctx.request.body.regType;
	ctx.body = {
		a: 111,
		b: 222
	}
}

SongController.getSongDetail = async function (ctx) {
	const regType = ctx.request.body.regType;
	
}

module.exports = SongController;