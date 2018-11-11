var express = require('express');
const request = require('request');
var srequest = require('sync-request');
var MongoClient = require('mongodb').MongoClient

var places = {};
var images = {};

var hours = [ '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23' ];
var minutes = [ '00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55' ];

var retrieve_flights = function() {
	request('http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/UK/gbp/en-GB/uk/anywhere/anytime/anytime?apikey=ha828488142052428051835227839847', { json: true }, (err, res, body) => {
	  if (err) { return console.log(err); }
	  MongoClient.connect('mongodb://localhost:27017/flindr', { useNewUrlParser: true }, function (err, client) {
		if (err) throw err;

		var db = client.db('flindr')
		body.Places.forEach(function(item, index) {
		  if(item.Type == 'Station') {
	  	  places[item.PlaceId] = item.Name + ', ' + item.CountryName;
	  	  var city = item.Name.toLowerCase().split(' ').join('_');
		  var url = 'https://api.teleport.org/api/urban_areas/slug:' + city + '/images/';
	  	  var res;
	  	  try {
	  	  	res = srequest('GET', url).getBody();
	  	  	res = JSON.parse(res);
	  		console.log(res['photos'][0]['image']['mobile']);
	  		images[item.PlaceId] = res['photos'][0]['image']['mobile'];
	  		var myobj = {
  			PlaceID: item.PlaceId,
  			CountryName: item.CountryName,
  			CityName: item.Name,
  			Name: item.Name + ', ' + item.CountryName,
  			URL: images[item.PlaceId] };
	  	  	db.collection("places").insertOne(myobj, function(err, res) { });
	  	  }
	  	  catch(err) {}
	  	  
		  //if((typeof body != 'string') && !('status' in body)) {
		  
	  	  
	      
		  /*
		  	
		  });*/
		}
		});
	 	db.collection('flights').drop((err, ok) => {});
		db.collection('savedflights').drop((err, ok) => {});
	 	db.collection('places').createIndex(
		   { PlaceID: 1 },
		   { unique: true }
		);
		console.log(images)
	  	body.Quotes.forEach(function(item, index) {
	  		if(item.OutboundLeg.DestinationId in images) {
		  		var hour = hours[Math.floor(Math.random()*hours.length)];
		  		var minute = minutes[Math.floor(Math.random()*minutes.length)];
		  		var time = hour + ':' + minute;
		  		var myobj = {
		  			Origin: places[item.OutboundLeg.OriginId],
		  			OriginID: item.OutboundLeg.OriginId,
		  			Destination: places[item.OutboundLeg.DestinationId],
		  			DestinationID: item.OutboundLeg.DestinationId,
					DepartureDate: item.OutboundLeg.DepartureDate.split("T")[0],
					DepartureTime: time,
		  			Price: item.MinPrice,
		  			URL: images[item.OutboundLeg.DestinationId]};
			  	db.collection("flights").insertOne(myobj, function(err, res) {
			    	if (err) throw err;
			  	});
			}
	  	});

	});
	});
};



module.exports = retrieve_flights;
