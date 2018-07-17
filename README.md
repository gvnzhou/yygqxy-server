# 粤语歌曲谐音-后端程序

## app.js

用于启动后端程序，提供前端需要的API接口。

### TODO
- [x] 完成获取歌曲列表API接口逻辑
- [x] 获取歌曲列表接口-支持条数查询
- [x] 反馈接口
- [x] 完成获取歌曲详情API接口逻辑
- [x] 优化spider.js爬取算法，通过歌手爬取更多歌曲数据
- [x] 优化spider2.js爬取算法，爬取的部分内容有问题
- [x] 支持记录首页热门歌曲模块（根据点击量排序）
- [x] 支持歌手名查询
- [ ] 获取歌曲列表接口-支持排序查询
<!-- - [ ] 增加通用错误提示模块 -->

## spider爬虫脚本

用于给小程序-粤语歌曲谐音爬取相关数据。

### spider.js

获取某网站歌曲数据。

### spider2.js

获取某网站免费歌曲数据。

### spider3.js

根据歌手名获取某网站数据。

### TODO

- [x] 请求并发数控制
- [x] mongodb存储数据


### config.js 文件格式（涉及小程序和服务器配置信息）

```javascript
const env = 'development';
const Config = {
  development: {
    WeChat: {
      APPID: 'xxx',
      SECRET: 'xxx'
    },
    Server: {
      host: '127.0.0.1',
      port: 5000
    },
    MongoDB: {
      host: 'localhost',
      port: '27017',
      dbName: 'yygqxy',
      username: 'admin',
      password: '123456'
    }
  },
  production: {
    WeChat: {
	  APPID: 'xxx',
      SECRET: 'xxx'
    },
    Server: {
      host: '127.0.0.1',
      port: 5000
    },
    MongoDB: {
      host: '127.0.0.1',
      port: '27017',
      dbName: 'yygqxy'
    }
  }
};

module.exports = Config[env];
```


