var express = require('express');
var router = express.Router();

var cors = require('cors')
var getFlightsList = require('../controllers/FlightsListController.js');
var SaveFlightController = require('../controllers/SaveFlightController.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/flights', cors(), function(req, res, next) {
  getFlightsList(res);
});

router.post('/saveflight', function(req, res, next) {
  SaveFlightController.saveFlight(req, res);
});

router.get('/saveflight', function(req, res, next) {
  SaveFlightController.getSavedFlights(res);
});

module.exports = router;
