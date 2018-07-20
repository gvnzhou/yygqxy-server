const db = require('../lib/mongodb');

const userAuthController = async function (ctx, next) {
	// 验证3rd_session
	function verifyThirdSession (session) {
		return new Promise(function (resolve, reject) {
			db.c('third_session').find({ key: session }).toArray(function (err, docs) {
				
			})
		})
	}
	if ('third-session' in ctx.request.header) {
	
	} else {
		ctx.body = {
			code: 999,
			error: 'thirdSession不能为空'
		}
	}
	next()
};

module.exports = userAuthController;