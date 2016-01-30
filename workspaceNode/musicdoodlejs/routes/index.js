var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { version: '20162301-0807' });
});

router.get('/voteAlbum', function(req, res, next) {
	res.render('voteAlbum', { version: '20162301-0807' });
});

router.get('/ranking', function(req, res, next) {
	res.render('ranking', { version: '20162301-0807' });
});

module.exports = router;
