var express = require('express');
const request = require('request');
var MongoClient = require('mongodb').MongoClient

var places = {};

var hours = [ '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23' ];
var minutes = [ '00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55' ];

var retrieve_flights = function() {
	request('http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/UK/gbp/en-GB/uk/fr/anytime/anytime?apikey=ha828488142052428051835227839847', { json: true }, (err, res, body) => {
	  if (err) { return console.log(err); }
	  MongoClient.connect('mongodb://localhost:27017/flindr', { useNewUrlParser: true }, function (err, client) {
		if (err) throw err;

		var db = client.db('flindr')
		body.Places.forEach(function(item, index) {
		  places[item.PlaceId] = item.Name + ', ' + item.CountryName;
		  if(item.Type == 'Station') {
		  var myobj = {
	  			PlaceID: item.PlaceId,
	  			CountryName: item.CountryName,
	  			CityName: item.Name,
	  			Name: item.Name + ', ' + item.CountryName };
		  db.collection("places").insertOne(myobj, function(err, res) {
		  });
		}
		 });
	 	db.collection('flights').drop((err, ok) => {});
	 	db.collection('places').createIndex(
		   { PlaceID: 1 },
		   { unique: true }
		);
	 	var counter = 0;
	  	body.Quotes.forEach(function(item, index) {
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
	  			Price: item.MinPrice };
		  	db.collection("flights").insertOne(myobj, function(err, res) {
		    	if (err) throw err;
		    	counter = counter + 1;
		  	});

	  	});
	  	console.log(counter + " flight inserted");
	  	client.close();
	});
	});
};



module.exports = retrieve_flights;
