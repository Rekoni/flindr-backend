var express = require('express');
var router = express.Router();
var getFlightsList = require('../controllers/FlightsListController');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/flights', function(req, res, next) {
  getFlightsList(res);
});

module.exports = router;
