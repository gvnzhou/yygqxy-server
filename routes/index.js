const Router = require('koa-router');
const SongController = require('../controllers/song')
const UserController = require('../controllers/user')

const router = Router();

router
  .get('/api/song', SongController.getSongList)
  .get('/api/song/:id', SongController.getSongDetail)
	.post('/api/user/feedback', UserController.postFeedback)
	.post('/api/user/login', UserController.login);

// for require auto in index.js
module.exports = router;