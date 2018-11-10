var sortJsonArray = require('sort-json-array');
var MongoClient = require('mongodb').MongoClient;

var getFlightsList = function(res) {
  MongoClient.connect('mongodb://localhost:27017/flindr', function (err, client) {
    if (err) throw err;

    var db = client.db('flindr');

    db.collection('flights').find().toArray(function(err, flightsList) {
      if (err) {
        return "ERROR: Could not get flights list!";
      }

      var sortedFlightsList = sortJsonArray(flightsList, 'Price');
      res.json(sortedFlightsList);

    });
  });
}

module.exports = getFlightsList;
