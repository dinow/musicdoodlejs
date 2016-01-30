/**
 * New node file
 */
var mysql      = require('mysql');
var connection = null;

module.exports = {
		getArtistList: function (callback) {
			connect();
			var artists = new Array();
			connection.query('SELECT distinct artists.id, artists.name FROM artists ORDER BY name ASC', function(err, rows, fields) {
				if (!err){
					for (var i = 0; i < rows.length; i++){
						artists.push({id: rows[i].id, name: rows[i].name});
					}
					callback(artists);
				}else{
					console.log('Error while performing Query.');
				}
				disconnect();
			});
			
	  },
	  getSongList: function (artistId, callback) {
		connect();
		var songs = new Array();
		connection.query('SELECT songs.id, songs.name as sname, albums.name as aname, IFNULL(song_hits.hits,0) hits FROM songs JOIN albums on songs.album_id = albums.id LEFT OUTER JOIN song_hits on songs.id = song_hits.song_id where songs.artist_id like ? ORDER BY albums.name, songs.name ASC',[artistId], function(err, rows, fields) {
			if (!err){
				for (var i = 0; i < rows.length; i++){
					songs.push({SONG_ID: rows[i].id, VOTES: rows[i].hits, ALBUM: rows[i].aname, NAME:rows[i].sname});
				}
				callback(songs);
			}else{
				console.log('Error while performing Query.');
			}
			disconnect();
		});
	  },
	  getAlbumList: function (artistId, callback) {
		connect();
		var albums = new Array();
		connection.query('SELECT albums.id, albums.name, IFNULL(albums.year,0) year FROM albums where albums.artist_id like ? ORDER BY albums.name ASC',[artistId], function(err, rows, fields) {
			if (!err){
				for (var i = 0; i < rows.length; i++){
					albums.push({ALBUM_ID: rows[i].id, ALBUM: rows[i].name, YEAR: rows[i].year});
				}
				callback(albums);
			}else{
				console.log('Error while performing Query.');
			}
			disconnect();
		});
	  },
	  getCurrentRanking: function (callback) {
			connect();
			var albums = new Array();
			connection.query('select albums.name as album, songs.name as sname,  artists.name as aname, song_hits.hits hits from song_hits join songs on songs.id = song_hits.song_id join artists on songs.artist_id = artists.id JOIN albums ON songs.album_id = albums.id order by song_hits.hits DESC', function(err, rows, fields) {
				if (!err){
					for (var i = 0; i < rows.length; i++){
						albums.push({
							VOTES: rows[i].hits,
							ALBUM: rows[i].album,
							ARTIST: rows[i].aname,
							SONGNAME: rows[i].sname
							});
					}
					callback(albums);
				}else{
					console.log('Error while performing Query.');
				}
				disconnect();
			});
			
		  },
	  resetVotes:function (callback) {
		  connect(); 
		  connection.query('delete from song_hits',function(err, rows, fields) {
				if (!err){
					callback(rows);
				}else{
					console.log('Error while performing Query.');
				}
				disconnect();
			});
		  
	  },
	  voteForSong:function (songId, callback) {
		  
		    var previousCount = 0;
		    connect(); 
			
			connection.query('SELECT IFNULL(song_hits.hits,0) hits FROM song_hits where song_hits.song_id = ?',[songId],function(err, rows, fields) {
				if (!err){
					if (rows.length == 0){
						//insert
						var query = connection.query('INSERT INTO song_hits SET ?',{song_id : songId,hits: 1},function(err, rows, fields) {
							if (!err){
								callback(1);
							}else{
								console.log('Error while performing Query INSERT INTO song_hits ' + err);
							}
							disconnect();
						});
					}else{
						previousCount = rows[0].hits;
						previousCount++;
						connection.query('UPDATE song_hits set hits = ? where song_id = ?',[previousCount, songId],function(err, rows, fields) {
							if (!err){
								callback(previousCount);
							}else{
								console.log('Error while performing Query UPDATE song_hits');
							}
							disconnect();
						});
						
					}
				}else{
					console.log('Error while performing Query SELECT IFNULL(song_hits.hits,0) hits');
				}
			}); 
	  }	  
};


function connect(){
	connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'mdoodle',
		password : 'mdoodle',
		database : 'mdoodle_db'
	});
	connection.connect();
}

function disconnect(){
	connection.end();
}