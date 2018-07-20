const Router = require('koa-router');
const SongController = require('../controllers/song')
const UserController = require('../controllers/user')
const UserAuthController = require('../controllers/userAuth')

const router = new Router({
	prefix: '/api'
});



router
	.use(['/user/getCollections', '/user/addCollections'], UserAuthController)
  .get('/song', SongController.getSongList)
  .get('/song/:id', SongController.getSongDetail)
	.post('/user/feedback', UserController.postFeedback)
	.post('/user/login', UserController.login)
	.get('/user/getCollections', UserController.getUserCollection)
	.post('/user/addCollections', UserController.AddUserCollection);

// for require auto in index.js
module.exports = router;