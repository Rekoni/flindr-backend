var MongoClient = require('mongodb').MongoClient;

module.exports.saveFlight = function(req, res) {
  MongoClient.connect('mongodb://localhost:27017/flindr', { useNewUrlParser: true }, function (err, client) {
    if (err) throw err;

    var db = client.db('flindr');

    db.collection('savedflights').insertOne(req.body, function(err, result) {
      if (err) {
        res.send("ERROR: Could not save flight!\n");
      }
      res.send("Success!\n");
    });



  });
};

module.exports.getSavedFlights = function(res) {
  MongoClient.connect('mongodb://localhost:27017/flindr', { useNewUrlParser: true }, function (err, client) {
    if (err) throw err;

    var db = client.db('flindr');
    db.collection('savedflights').find().toArray(function(err, flightsList) {
      if (err) {
        res.send("ERROR: Could not get saved flights list!\n");
      }

      res.json(flightsList);
    });

  });
}
