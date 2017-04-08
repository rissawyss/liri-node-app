//Variable for user input
var command = process.argv[2];

//Variables for respective npm modules
var spotify = require('spotify');
var omdb = require('omdb');
var fs = require("fs");
var Twitter = require('twitter');

//Variables for album and movie info to be displayed as object
var albumObj = {};
var movieObj = {};

//Store Twitter access keys in a variable.
var myKeys = require('./keys');
var myTokens = myKeys.twitterKeys;
var myConsKey = myTokens.consumer_key;
var myConsSec = myTokens.consumer_secret;
var myAccToKey = myTokens.access_token_key;
var myAccToSec = myTokens.access_token_secret;
 
var client = new Twitter({
  consumer_key: myConsKey,
  consumer_secret: myConsSec,
  access_token_key: myAccToKey,
  access_token_secret: myAccToSec
});

//Store Twitter parameters in variable
var params = {screen_name: 'rissawyss', count: 20};


//Function that takes in the following commands: my-tweets; spotify-this-song; movie-this; do-what-it-says
function liriBot() {
if (command === "my-tweets") {
	logCommand(command);
	myTweets();
} else if (command === "spotify-this-song") {
	logCommand(command);
	var songName = process.argv[3];
		if (songName === undefined) {
			songName = "The Sign";
			var artist = "Ace of Base";
			defaultSongResults(songName, artist);
		} else {
			songSearch(songName);
		}
} else if (command === "movie-this") {
	logCommand(command);
	var movie = process.argv[3];
		if (movie === undefined) {
			movie = "Mr. Nobody";
			movieSearch(movie);
		} else {
			movieSearch(movie);
		}
} else if (command === "do-what-it-says") {
	logCommand(command);
	doWhatItSays();
}
}

function myTweets(){
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	console.log("Tweets will be loaded here");
	    for (var i = 0; i < tweets.length; i++) {
	    console.log("=========================");
	    console.log("Date " + tweets[i].created_at);
	    console.log(tweets[i].text);
		}
	  }
	});	
}

//Function uses npm spotify module search method to search song info by track name, returns info in object called "data"
function songSearch(song){
	spotify.search({ type: 'track', query: song }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    } else {
		    //Iterate into spotify object by saving path in variable
		    var albumInfo = data.tracks.items;
		    //Place Artist, Song Name, Preview url, Album into Object - albumObj
		    albumObj.songName = song;
		    var previewUrl = albumInfo[0].preview_url;
		    albumObj.previewUrl = albumInfo[0].preview_url;
		    var albumName = albumInfo[1].album.name;
		    albumObj.albumName = albumInfo[1].album.name;
		    var artist = albumInfo[0].artists;
		    albumObj.artist = artist[0].name;
		    //Display Object containing all info: Artist, Song Name, Preview url, Album
		    console.log("=========ALBUM-INFO=============");
		    console.log(albumObj);
		}
	});
}

//Function uses npm spotify module search method to search song info by both artist name and track name, returns info in object called "data"
function defaultSongResults(song, band){
	spotify.search({ type: 'artist', query: band} && { type: 'track', query: song}, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    } else {
	    	albumObj.songName = song;
	    	albumObj.albumName = "The Sign (US Album) [Remastered]";
	    	albumObj.previewUrl = 'https://p.scdn.co/mp3-preview/4c463359f67dd3546db7294d236dd0ae991882ff?cid=null';
	    	albumObj.artist = band;
    		console.log(albumObj);
		}
	});
}

//Function uses npm omdb module search method to search movie info by title then returns info in object called "movies"
function movieSearch(title) { 
	omdb.search(title, function(err, movies) {
	    if(err) {
	        return console.error(err);
	    }
	 
	    if(movies.length < 1) {
	        return console.log("No movies found. Please try another movie.");
	    }
	    //Function uses npm omdb module get method to retrieve movie info by title & year then returns info in object called "movie"
	    for (var i = 0; i < movies.length; i++) {
	        	omdb.get({ title: movies[i].title, year: movies[i].year }, true, function(err, movie) {
    				if(err) {
        			return console.error(err);
    				}
    				    if(!movie) {
    				    	return console.log("No movies found. Please try another movie");
					    }
					    console.log("=============================");
					    //Place Title, Year, Rating, Actors, Countries, Plot into Object - movieObj
					    var movieTitle = movie.title;
					    var year = movie.year;
					    var imdbRating = movie.imdb.rating;
					    var actors = movie.actors;
					    var countries = movie.countries;
					    var plot = movie.plot;
					    movieObj.movieTitle = movie.title;
					    movieObj.movieTitle = movie.title;
					    movieObj.year = movie.year;
					    movieObj.imdbRating = movie.imdb.rating;
					    movieObj.actors = movie.actors;
					    movieObj.countries = movie.countries;
					    movieObj.plot = movie.plot;
					    //Stringify movieObj
					    console.log(JSON.stringify(movieObj, null, 2));

	    		});
    	}
    });
}


//Function uses npm file system module to read file and return info into an array 
function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(err, data) {
	  // Break the string down by comma separation and store the contents into the output array.
	  var output = data.split(",");
	  //First item in array = command, Second item in array = process.argv[3], then call liriBot function to pass in arguments
	    command = output[0];
	    readFileSong = output[1];
	    process.argv[3] = readFileSong;
	    liriBot();
	});
}


function logCommand(entry) {
  // Add the command value to the log file.
  fs.appendFile("log.txt", ", " + entry);
}



liriBot();
