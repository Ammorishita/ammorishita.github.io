'use strict';
var infowindow, oauthSignature, weatherIconURL, content, content2, map, i, articleStr, thisLocation, wikiContent, google, ko, $;
var initialMarkers = [
	{
		'title' : 'Phils BBQ, San Marcos',
		'location' : 'San Marcos, CA',
		'position' : {lat: 33.131536, lng: -117.185134},
		'image' : 'images/Phils.png'
	},
	{
		'title' : 'Phils BBQ, San Diego',
		'location' : 'San Diego, CA',
		'position' : {lat: 32.754631, lng: -117.215972},
		'image' : 'images/Phils.png',
		'search' : 'Phils BBQ'
	},
	{
		'title' : 'Manna Korean BBQ, San Diego',
		'location' : 'San Diego, CA',
		'position' : {lat: 32.821301, lng: -117.156154},
		'image' : 'images/kbbq.png'
	},
	{
		'title' : 'Manna Korean BBQ, Mira Mesa',
		'location' : 'San Diego, CA',
		'position' : {lat: 32.915804, lng: -117.147914},
		'image' : 'images/kbbq.png'
	},
	{
		'title' : 'Lumberyard Tavern and Grill, Encinitas',
		'location' : 'Encinitas, CA',
		'position' : {lat: 33.039829, lng: -117.292110},
		'image' : 'images/tavern.png'
	},
];

var b = {
	'title' : 'TEST Tavern and Grill, Encinitas',
	'location' : 'Encinitas, CA',
	'position' : {lat: 33.069829, lng: -117.292110},
	'image' : 'images/tavern.png'
};


var Markers = function(data) {
	this.title = data.title;
	this.location = data.location;
	this.position = data.position;
	this.image = data.image;
	this.marker = data.marker;
	this.id = data.id;
};
var Wiki = function(data) {
	this.title = data;
	this.url = 'http://en.wikipedia.org/wiki/' + data;
};
var Wiki2 = function(data) {
	this.snippet = data;
};
var Weather = function(data) {
	this.maintemp = 'Current Temperature: ' + data.main.temp + '\u2103';
	this.icon = weatherIconURL + data.weather[0].icon +'.png';
	this.description = data.weather[0].description;
	this.city = thisLocation;
	this.clouds = 'Cloud Coverage: ' + data.clouds.all +'%';
	this.wind = 'Wind Speed (m/s): ' + data.wind.speed;
};
/*var Yelp = function(data){
	this.title = data.id;
	this.image = data.image_url;
	this.text = data.snippet_text
};*/
var ViewModel = function() {	
	var self = this;
	var currentMarker = null;
	//Bind marker with list.
	self.itemclick = function(markerItem){
		google.maps.event.trigger(this.marker, 'click'); 
	};

	//Create google map	
	self.map = new google.maps.Map(document.getElementById('map'),{
		center: {lat: 32.921186, lng: -117.167509},
		zoom: 10
	});
	//Declare error false/true to hide/show visible bindindg.
	self.error = ko.observable(false);
	self.working = ko.observable(true);
	self.weather = ko.observable(false);
	self.yelpError = ko.observable(false);
	//Observable array for the wiki and weather api results.
	self.wikiResults = ko.observableArray([]);
	self.wikiResults2 = ko.observableArray([]);
	self.weatherResults = ko.observableArray([]);
	//self.yelpResults = ko.observableArray();

	//Weather API function
	self.weatherAPI = function(){
		self.working(false);
		self.weather(true);
		self.weatherResults([]);
		var key = '1c2345da8528da89ff0071bcdd221cce';
		thisLocation = thisLocation.slice(0,-4);
		var weatherURL = 'http://api.openweathermap.org/data/2.5/weather?APPID=' + key +'&q=' + thisLocation + '&units=metric';
		weatherIconURL = 'http://openweathermap.org/img/w/';
		$.ajax({
			url: weatherURL,
			dataType: 'json'
		}).done(function(response){
			console.log(response);
			self.weatherResults.push(new Weather(response));
			
			console.log(self.weatherResults());
		}).fail(function(){
			self.error(true);
		});

	};


	self.yelpAPI = function(){
		function nonce_generate() {
  			return (Math.floor(Math.random() * 1e12).toString());
		}
		var YELP_BASE_URL = 'https://api.yelp.com/v2/search/';
		var YELP_KEY_SECRET = 'YJgc-BtCt9ogrrDXz5ptbkFJ3mo';
		var YELP_TOKEN_SECRET = 'gK1IB6E7txoJUpH3AK7p52iF8MQ';
		var yelp_url = YELP_BASE_URL;

	    var parameters = {
	      oauth_consumer_key: 'REfQ41eJe5W6cOXEKbedIw',
	      oauth_token: 'yXeLtJ768XlAbLUoLwPJAnRqCSZv5MI_',
	      oauth_nonce: nonce_generate(),
	      oauth_timestamp: Math.floor(Date.now()/1000),
	      oauth_signature_method: 'HMAC-SHA1',
	      oauth_version : '1.0',
	      callback: 'cb', 
	      limit: 1,
	      term: content,
	      location: 'San+Diego'
	    };
    	var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
    	parameters.oauth_signature = encodedSignature;
	    var settings = {
	      url: yelp_url,
	      data: parameters,
	      cache: true,
	      dataType: 'jsonp',
	      callback: 'cb'
	    };

	    $.ajax(settings).done(function(results){
	    	console.log(results);
	    	//var newresults = results.businesses[0];
	    	var yelpID = results.businesses[0].id;
	    	var yelpImage = results.businesses[0].image_url;
	    	var yelpSnippet = results.businesses[0].snippet_text;
	    	var yelpURL = results.businesses[0].url;
	    	//Set content of infowindow.
	    	var infoContent = '<div id="infowindow"><div class="infowindow-title center"><h2>'+ content + '</h2>' + '</div><div class="infowindow-image"><img src="' + yelpImage + '"></img></div><div class="infowindow-snippet"><p>"' + yelpSnippet + '"</p></div><div class="infowindow-link center"><a href="' + yelpURL + '" alt="Yelp Image" target="_new">Find ' + content +' on Yelp!</a></p></div></div>';
	    	//self.yelpResults.push(new Yelp(newresults));
			self.infowindow.setContent(infoContent);		    	
	    }).fail(function(){
	    	self.yelpError(true);
	    	var infoContent = '<div class="infowindow-title center"><h2>'+ content + '</h2>' + '</div><p data-bind="visible: yelpError">Failed to load YELP Results"</p>';
	    	self.infowindow.setContent(infoContent);
	    });
	};

	self.infowindow = new google.maps.InfoWindow({});

	//Create and add markers into an array
	self.markerList = ko.observableArray([]);
	initialMarkers.forEach(function(markerItem){
		self.markerList().push(new Markers(markerItem));
	});
	self.markerList().forEach(function(markerItem){
		//Create object literal with marker properties.
		var markerPins = {
			map: self.map,
			position: markerItem.position,
			icon: markerItem.image,
			animation: google.maps.Animation.DROP,
		};
		//Create markers for each markerItem.
		markerItem.marker = new google.maps.Marker(markerPins);
		markerItem.marker.addListener('click', function(){
			content = markerItem.title;
			thisLocation = markerItem.location;
			console.log(thisLocation);
			//Run the yelp and weather api for results.
			self.yelpAPI();
			self.weatherAPI();
			self.infowindow.open(self.map, this);
			
			//self.infowindow.setContent(content);	
			wikiContent = markerItem.location;
			self.map.setZoom(11);
			self.map.setCenter(this.position);



			//Animate marker and stop animation on last clicked marker
			if (currentMarker) {
				currentMarker.setAnimation(null);
			}
			currentMarker = this;
			this.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				currentMarker.setAnimation(null);	
			},1400);
		});
	});
	//Filter markers and list items.
	self.searchTerm = ko.observable('');
	self.filter = ko.computed(function(){
		return ko.utils.arrayFilter(self.markerList(), function(item){
			item.marker.setVisible(false);
			if (item.title.toLowerCase().indexOf(self.searchTerm().toLowerCase()) >= 0) {
				item.marker.setVisible(true);
				return true;
			} else {
				item.marker.setVisible(false);
				return false;
			}
		});
	});
};

function init(){
	ko.applyBindings(new ViewModel());
}
function googleError(){
	window.alert('Google maps failed to load');
}
