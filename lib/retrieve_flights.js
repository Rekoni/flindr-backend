var express = require('express');
const request = require('request');
var MongoClient = require('mongodb').MongoClient

var places = {};

var retrieve_flights = function() {
	request('http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/UK/gbp/en-GB/uk/fr/anytime/anytime?apikey=ha828488142052428051835227839847', { json: true }, (err, res, body) => {
	  if (err) { return console.log(err); }
	  body.Places.forEach(function(item, index) {
	  		places[item.PlaceId] = item.Name + ', ' + item.CountryName;
	  });
	  MongoClient.connect('mongodb://localhost:27017/flindr', function (err, client) {
		if (err) throw err

		var db = client.db('flindr')
	  	body.Quotes.forEach(function(item, index) {
	  		var myobj = { Origin: places[item.OutboundLeg.OriginId], Destination: places[item.OutboundLeg.DestinationId], Price: item.MinPrice };
		  	db.collection("flights").insertOne(myobj, function(err, res) {
		    	if (err) throw err;
		    	console.log("1 flight inserted");
		  	});
	  	});
	  	client.close();
	});
	});
};



module.exports = retrieve_flights;