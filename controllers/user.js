const db = require('../lib/mongodb');
const ObjectID = require('mongodb').ObjectID;
const superagent = require('superagent');
const Config = require('../config');
const { exec } = require('child_process');

const UserController = {};

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
			exec('cat /dev/urandom | head -n 10 | md5sum | head -c 10', (err, stdout, stderr) => {
				if(err) {
					reject(err);
				} else {
					resolve(stdout);
				}
			})
		})
	}
	// 保存3rd_session信息
	function insertThirdSession (key, value) {
		return new Promise(function (resolve, reject) {
			// 保存3rd_session信息
			db.c('third_session').find({ key: key }).toArray(function (err, docs) {
				if (err) {
					reject(err)
				}
				if (docs.length === 0) {
					db.c('third_session').insertOne({key: key, value: value}, function (err) {
						if (err) {
							reject(err);
						}
						resolve()
					});
				}
			})
		})
	}
	// 保存用户信息
	function insertUserInfo (openid, userInfo) {
		return new Promise(function (resolve, reject) {
			db.c('user').find({ openid: openid }).toArray(function (err, docs) {
				if (err) {
					reject(err)
				}
				if (docs.length === 0) {
					db.c('user').insertOne({
						openid: openid,
						nickname:  userInfo.nickName,
						gender:  userInfo.gender,
						language:  userInfo.language,
						city:  userInfo.city,
						province:  userInfo.province,
						country:  userInfo.country,
						avatarUrl:  userInfo.avatarUrl,
						collections: []
					}, function (err) {
						if (err) {
							reject(err)
						}
						resolve()
					})
				} else {
					resolve()
				}
			})
		})
	}
	
	let wxRes, thirdSessionKey, thirdSessionValue
	const jsCode = ctx.request.body.code;
	
	try {
		wxRes = await getWxOpenId(jsCode, Config.WeChat.APPID, Config.WeChat.SECRET);
	} catch(e) {
		ctx.body = {
			code: 999,
			error: e
		};
	}
	
	try {
		thirdSessionKey = await generateRandomNum();
	} catch(e) {
		ctx.body = {
			code: 999,
			error: e
		};
	}
	
	thirdSessionValue = wxRes.openid + '|' + wxRes.session_key;
	
	//  保存third_session和用户信息
	try {
		await insertThirdSession(thirdSessionKey, thirdSessionValue);
		await insertUserInfo(wxRes.openid, ctx.request.body.userInfo);
	} catch(e) {
		ctx.body = {
			code: 999,
			error: e
		};
	}
	
	ctx.body = {
		code: 200,
		thirdSession: thirdSessionKey
	};
}

UserController.AddUserCollection = async function (ctx, next) {
	const thirdSession = ctx.request.header['third-session']
	// 验证thirdSession
	function verifyThirdSession () {
		return new Promise(function (resolve, reject) {
			db.c('third_session').find({ key: thirdSession }).toArray(function (err, docs) {
				if (err) {
					reject(err)
				}
				if (docs.length) {
					resolve(docs)
				} else {
					resolve(false)
				}
			})
		})
	}
	// 更新收藏
	function addCollections(openid, id) {
		return new Promise(function (resolve, reject) {
			db.c('user').find({ openid: openid }).toArray(function (err, docs) {
				if (err) {
					reject(err)
				}
				if (docs.length) {
					if (docs[0].collections.indexOf(id) === -1) {
						docs[0].collections.push(id)
						db.c('user').update({ openid: openid }, { $set: { collections: docs[0].collections } }, function (err, res) {
							if (err) {
								reject(err)
							}
							resolve(res)
						})
					} else {
						reject('请勿重复收藏')
					}
				} else {
					reject('未查到到当前用户')
				}
			})
		})
	}
	try {
		let authRes = await verifyThirdSession()
		if (authRes) {
			let updateRes = await addCollections(authRes[0].value.split('|')[0], ctx.request.body.id)
			if (updateRes.result.n === 1) {
				ctx.body = {
					code: 200,
					error: '收藏成功'
				};
			}
		} else {
			ctx.body = {
				code: 999,
				error: '请先授权登录'
			};
		}
	} catch (e) {
		ctx.body = {
			code: 999,
			error: e
		};
	}
	
}

UserController.getUserCollection = async function (ctx, next) {
	// 校验用户身份，查询openid和session_key，判断是否过期
	const thirdSession = ctx.request.header['third-session']
	
	
	ctx.body = {
		code: 200,
		data: {}
	};
}

// 废弃
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