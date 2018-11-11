var express = require('express');
var router = express.Router();
var getFlightsList = require('../controllers/FlightsListController.js');
var SaveFlightController = require('../controllers/SaveFlightController.js');

router.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/flights', function(req, res, next) {
  getFlightsList(res);
});

router.post('/saveflight', function(req, res, next) {
  SaveFlightController.saveFlight(req, res);
});

router.get('/saveflight', function(req, res, next) {
  SaveFlightController.getSavedFlights(res);
});

module.exports = router;
