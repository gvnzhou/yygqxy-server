const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const superagent = require('superagent');
const cheerio = require('cheerio');
const eventproxy = require('eventproxy');
const async = require('async');



const Spider = (function SpiderModule() {
  // Spider Config
  const targetURL = 'http://www.midmusic.cn/tag/mianfei/page/';
  const baseURL = 'http://www.midmusic.cn/';
  // fetch target urls cell
  function startCrawl () {
    // console.log('start crawling urls......');
    let index = 1;
    let isFetchNext = true;
    let urlsArray = [];

    function fetchListUrl (url) {
      superagent.get(url).end(function (err, res) {
        assert.equal(null, err);

        let $ = cheerio.load(res.text);
        $('.content>.excerpt').each(function (item) {
          urlsArray.push($(this).find('h2>a').attr('href'));
        })

        // 判断是否存在下一页
        if ($('.next-page').children().length) {
          ++index
          console.log(index)
          fetchListUrl(targetURL + index)
        } else {
          fetchTargetData(urlsArray)
        }
  
        // console.log('finish crawling urls......');
        // fetchTargetData(urlsArray)
      });
    }

    fetchListUrl(targetURL + index)
  }

  function fetchTargetData (urls) {
    function fetchUrl(url, callback) {
      curCount++;
      console.log('Number of concurrent connections is', curCount, ', Crawling Url:', url);
      superagent.get(url).end(function (err, res) {
        assert.equal(null, err);
        curCount--;
        
        let $ = cheerio.load(res.text);
        let songObj = {};
        let tempStr = $('.article-title a').text().split('-');
        songObj.name = tempStr[1].replace(/《(\S+)》粤语谐音发音/, '$1');
        songObj.singer = tempStr[0];
        songObj.introduction = '';
        songObj.content = $('.article-content p').eq(-2).text();
        songObj.clickCount = 0;
        songObj.updateTime = +new Date();

        // filter ad
        songObj.content = songObj.content.replace(/\n\S+\n\S+\n/, '').replace(/\n/g, '|');
        
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