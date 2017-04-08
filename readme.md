# HW10 – {LIRI Bot}
Homework week 10 for UCLA Coding BootCamp.
LIRI is a Language Interpretation and Recognition Interface. 
LIRI will be a command line node app that takes in parameters and gives you back data.

## Description and Requirements
LIRI Bot takes in one of the following commands, and displays information in the terminal/bash window:
 -my-tweets
 -spotify-this-song
 -movie-this
 -do-what-it-says

### my-tweets
Displays last 20 tweets and when they were created.

### spotify-this-song '<song name here>'
Displays the following song information:
 -Artist(s)
 -The song's name
 -A preview link of the song from Spotify
 -The album that the song is from
If no song is provided then your program will default to the song "The Sign" by Ace of Base

### movie-this '<movie name here>'
Displays the following movie information:
 -Title of the movie.
 -Year the movie came out.
 -IMDB Rating of the movie.
 -Country where the movie was produced.
 -Plot of the movie.
 -Actors in the movie.
If no movie is provided then your program will default to the movie "Mr. Nobody"

### do-what-it-says
Using the fs Node package, LIRI will take the text inside of a file random.txt and then use it to call one of LIRI's commands.
 -Text inside of random.txt: spotify-this-song, "I Want it That Way"
 -Will run the spotify-this-song command for the respective song

### Command log
Using the fs Node package, outputs the commands entered into a .txt file called log.txt.
 -Appends each command you run to the log.txt file.

## Technologies Used
	-Node.JS
	-Node Package Modules
		-Twitter
		-omdb
		-spotify
		-fs (File System)

-------------

## CODE EXPLANATION

### NODE PACKAGE MODULES
Variables declared to access node packages for function call backs

```
var spotify = require('spotify');
var omdb = require('omdb');
var fs = require("fs");
var Twitter = require('twitter');

```

### SONG SEARCH
Created a function using the spotify node package module and search method to search for song info by track name

```
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

```

### Do What It Says
Created a function which uses the File System Node Package Module to read a file, return the info into an array, then pass the respective info for the command line to run the LIRI Bot function.

```
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

```