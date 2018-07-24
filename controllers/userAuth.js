const db = require('../lib/mongodb');

const userAuthController = async function (ctx, next) {
	// 验证3rd_session
	function verifyThirdSession (session) {
		return new Promise(function (resolve, reject) {
			db.c('third_session').find({ key: session }).toArray(function (err, docs) {
				if (err) {
					reject(err)
				}
				if (docs.length) {
					resolve(docs[0].value.split('|')[0])
				} else {
					reject('thirdSession无效，请先授权登录！')
				}
			})
		})
	}
	if ('third-session' in ctx.request.header) {
		try {
			ctx.request.body.openid = await verifyThirdSession(ctx.request.header['third-session'])
			return next()
		} catch (e) {
			ctx.body = {
				code: 901,
				error: e
			}
		}
	} else {
		ctx.body = {
			code: 999,
			error: 'thirdSession不能为空'
		}
	}
};

module.exports = userAuthController;