var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var data = {
    'name': 'Anuj',
    'email': 'anuj@anuj.com'
  };
  res.send(JSON.stringify(data));
});

module.exports = router;
