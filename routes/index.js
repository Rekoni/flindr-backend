var express = require('express');
var router = express.Router();
var getFlightsList = require('../controllers/FlightsListController');
var saveFlight = require('../controllers/SaveFlightController');
var cors = require('cors')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/flights', cors(), function(req, res, next) {
  getFlightsList(res);
});

router.get('/saveflight', function(req, res, next) {
    saveFlight(req, res);
});

module.exports = router;
