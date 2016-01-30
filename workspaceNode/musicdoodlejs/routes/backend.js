var express = require('express');
var router = express.Router();
var genericDAO = require('../dao/genericDAO');


router.post('/', function(req, res, next) {
	switch(req.body.action) {
    	case 'getArtistList':
    		genericDAO.getArtistList(function(rows){
    			res.setHeader('Content-Type', 'application/json');
        	    res.send(JSON.stringify(rows, null, 3));
    		});
    		break;
    	case 'getSongList':
    		genericDAO.getSongList(req.body.artistId, function(rows){
    			res.setHeader('Content-Type', 'application/json');
        	    res.send(JSON.stringify(rows, null, 3));
    		});
    		break;
    	case 'getAlbumList':
    		genericDAO.getAlbumList(req.body.artistId, function(rows){
    			res.setHeader('Content-Type', 'application/json');
        	    res.send(JSON.stringify(rows, null, 3));
    		});
    		break;
    	case 'resetVotes':
    		genericDAO.resetVotes(function(rows){
    			res.setHeader('Content-Type', 'application/json');
        	    res.send(JSON.stringify({msg: 'Success'}, null, 3));
    		});
    		break;
    	case 'voteForSong':
    		genericDAO.voteForSong(req.body.songId,function(hits){
    			res.setHeader('Content-Type', 'text/html');
        	    res.send(hits, null, 3);
    		});
    		break;
    	case 'getCurrentRanking':
    		genericDAO.getCurrentRanking(function(rows){
    			res.setHeader('Content-Type', 'application/json');
        	    res.send(JSON.stringify(rows, null, 3));
    		});
    		break;
    	default:
    		console.log("Unknown request " + req.body.action);
	}
});

module.exports = router;