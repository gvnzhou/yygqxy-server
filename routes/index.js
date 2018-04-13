const Router = require('koa-router');
const SongController = require('../controllers/song')

const router = Router();

router
  .get('/api/song', SongController.getSongList)
  .get('/api/song/:id', SongController.getSongDetail)
  .post('/api/feedback', SongController.postFeedback);

// for require auto in index.js
module.exports = router;