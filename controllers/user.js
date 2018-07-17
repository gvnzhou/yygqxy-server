const db = require('../lib/mongodb');
const ObjectID = require('mongodb').ObjectID;
const getQueryString = require('../lib/util').getQueryString;
const superagent = require('superagent');
const Config = require('../config');
const { exec } = require('child_process');

let UserController = {};

UserController.login = async function (ctx) {
	// 发起get请求, 获取openid和session_key
	function getWxOpenId (code, appid, secret) {
		const wxReqUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
		return new Promise((resolve, reject) => {
			superagent.get(wxReqUrl).end(function (err, res) {
				if (err) {
					reject(err);
				} else {
					resolve(JSON.parse(res.text));
				}
			});
		})
	}
	// 使用系统命令生成真随机数
	function generateRandomNum () {
		return new Promise((resolve, reject) => {
			exec('sudo /dev/urandom | head -n 10 | md5sum | head -c 10', (err, stdout, stderr) => {
				if(err) {
					reject(err);
				} else {
					resolve(stdout);
				}
			})
		})
	}
	const jsCode = ctx.request.body.code;
	const wxRes = await getWxOpenId(jsCode, Config.WeChat.APPID, Config.WeChat.SECRET);
	const thirdSessionKey = await generateRandomNum();
	const thirdSessionValue = wxRes.openid + wxRes.session_key;
	// 保存3rd_session
	console.log(db.c('third_session').find({_id: ObjectID(wxRes.openid)}).toArray())


	// 注册流程
	// 判断数据库是否记录,
	// 是，更新session_key、过期时间
	// 否，记录openid、session_key、过期时间、用户信息
	// 返回3rdsession
	ctx.body = {
		code: 200,
		data: {
			thirdSession: thirdSessionKey
		}
	};

}

UserController.getUserCollection = async function (ctx, next) {
	// 校验用户身份，查询openid和session_key，判断是否过期

	ctx.body = {
		code: 200,
		data: {}
	};
}

UserController.postFeedback = async function (ctx, next) {
	let contact = ctx.request.body.hasOwnProperty('contact') ? ctx.request.body.contact : '';

	const insertFeedback = function (data) {
		return new Promise(function (resolve, reject) {
			db.c('feedback').insertOne(data, function(err, result) {
				if (err) return reject(err);
				resolve(result.result);
			});
		})
	}

	if (ctx.request.body.hasOwnProperty('suggest') && ctx.request.body.suggest.length > 0) {
		let data = {
			suggest: ctx.request.body.suggest,
			contact: contact,
			createTime: +new Date()
		};
		let res = await insertFeedback(data);
		ctx.body = {
			code: 200,
			data: res
		};
	} else {
		ctx.body = {
			code: 999,
			error: 'suggest字段不能为空！'
		};
	}
}

module.exports = UserController;