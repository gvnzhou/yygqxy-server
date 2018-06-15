const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const superagent = require('superagent');
const cheerio = require('cheerio');
const eventproxy = require('eventproxy');
const async = require('async');

const Spider = (function SpiderModule() {
	// Spider Config
	const targetURL = 'https://www.feitsui.com/singer_s/';
	const baseURL = 'https://www.feitsui.com';
	// fetch target urls cell
	function startCrawl () {
		// console.log('start crawling urls......');
		superagent.get(targetURL).end(function (err, res) {
			assert.equal(null, err);

			let urlsArray = [];
			let $ = cheerio.load(res.text);

			$('#rightcolumn').find('a').each(function () {
				urlsArray.push(baseURL + $(this).attr('href'));
			})
			fetchTargetUrls(urlsArray)
		});
	}

	// 获取目标url
	function fetchTargetUrls (urls) {
		function fetchUrl(url, callback) {
			curCount++;
			// console.log('Number of concurrent connections is', curCount, ', Crawling Url:', url);
			superagent.get(url).end(function (err, res) {
				assert.equal(null, err);
				curCount--;
				let urlsArray = [];
				let $ = cheerio.load(res.text);

				$('#rightcolumn').find('a').each(function () {
					urlsArray.push(baseURL + $(this).attr('href'));
				})
				callback(null, urlsArray)
			})
		}

		let curCount = 0;

		async.mapLimit(urls, 10, function (url, callback) {
			fetchUrl(url, callback);
		}, function (err, results) {
			assert.equal(null, err);
			let res = []
			results.forEach(function (item) {
				res = res.concat(item)
			})
			fetchTargetData(res);
		});
	}

	// 详情页数据采集
	function fetchTargetData (urls) {
		function fetchUrl(url, callback) {
			curCount++;
			console.log('Number of concurrent connections is', curCount, ', Crawling Url:', url);
			superagent.get(url).end(function (err, res) {
				assert.equal(null, err);
				curCount--;

				let $ = cheerio.load(res.text);
				let songObj = {};
				songObj.name = $('#rightcolumn h1').text() + '（粤拼）';
				songObj.singer = $('#songinfo a').first().text();
				songObj.introduction = $('#songinfo p').last().text();
				songObj.content = $('#romanisation p').text();
				songObj.clickCount = 0;
				songObj.updateTime = +new Date();

				// filter ad
				songObj.content = songObj.content.replace(/翡翠粤语歌词/g, '').replace(/https\S+[0-9]\//g, '').replace(/([\u4e00-\u9fa5])(\w)/g, '$1|$2').replace(/(\w)(\s*)([\u4e00-\u9fa5])/g, '$1|$3');
				// add split mark
				// songObj.content = songObj.content.replace(/(([\u4e00-\u9fa5])(\s*)(\w))|((\w)(\s*)([\u4e00-\u9fa5]))/g, '[$1]');

				callback(null, songObj)
			})
		}

		let curCount = 0;

		async.mapLimit(urls, 10, function (url, callback) {
			fetchUrl(url, callback);
		}, function (err, results) {
			assert.equal(null, err);
			storeResult(results);
		});
	}

	// 数据保存
	function storeResult(res) {
		// Connection URL
		const url = 'mongodb://localhost:27017';
		// Database Name
		const dbName = 'yygqxy';
		// Collection Name
		const collectionName = 'song';

		MongoClient.connect(url, function(err, client) {
			assert.equal(null, err);
			// console.log("Connected successfully to server");

			const db = client.db(dbName);
			const collection = db.collection(collectionName);

			collection.insertMany(res, function(err, result) {
				assert.equal(err, null);
				console.log("Inserted Results Success!");
				client.close();
			});

		});
	}

	return {
		startCrawl
	};
})();

Spider.startCrawl();