var express = require('express');
var router = express.Router();
var sendResponse = require('../routes/sendResponse');
var useFunction = require('../routes/useFunction');
var async = require('async');
var randomstring = require('just.randomstring');
var adminModule = require('../models/adminModule');

/*
*----------------------------------------------
*API for admin Login
*INPUT: adminName and Password
*OUTPUT: Success message
*----------------------------------------------
*/

router.post('/login', function(req, res, next){
  var email = req.body.email;
  var password = req.body.password;
  var arrFeilds = {email, password};
  console.log('is working');
  async.waterfall([
    function (callback){
      useFunction.checkFeilds(res, arrFeilds, callback);
    }],
    function(error, result, next){
      sendResponse.sendSuccessData(arrFeilds, res);
    });

});

module.exports = router;
