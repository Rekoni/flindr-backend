var MongoClient = require('mongodb').MongoClient;

var saveFlight = function(req, res) {
  MongoClient.connect('mongodb://localhost:27017/flindr', { useNewUrlParser: true }, function (err, client) {
    if (err) throw err;

    var db = client.db('flindr');

    var flightID = req.flightID;

    db.collection('savedflights').insertOne(req, function(err, result) {
      if (err) throw err;
      db.collection('savedflights').find().toArray(function(err, flightsList) {
        if (err) {
          return "ERROR: Could not get saved flights list!";
        }
        res.json(flightsList);
      });
    });



  });
}

module.exports = saveFlight;
