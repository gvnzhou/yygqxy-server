
// 获取Url参数, name: 参数名， url: 可选（非浏览器环境必选）
module.exports.getQueryString = (name, url) => {
	let target = url ? url.substr(url.indexOf('?')) : window.location.search;
	let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	let r = target.substr(1).match(reg);
	if (r !== null) {
		return decodeURI(r[2]);
	}
	return null;
}
