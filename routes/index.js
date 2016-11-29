var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'This is Express' });
});

/* GET api page. */
router.get('/api', function(req, res, next) {
  res.render('api', { title: 'Welcome to API' });
});

module.exports = router;
