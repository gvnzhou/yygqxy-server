const Router = require('koa-router');
const SongController = require('../controllers/song')

const router = Router();

router.get('/api/song/register', SongController.register);

// for require auto in index.js
module.exports = router;