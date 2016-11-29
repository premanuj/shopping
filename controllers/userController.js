var express = require('express');
var router = express.Router();
var sendResponse = require('../routes/sendResponse');
var useFunction = require('../routes/useFunction');
var async = require('async');
var randomstring = require('just.randomstring');
var userModule = require('../models/userModule');

/*
*----------------------------------------------
*API for user Login
*INPUT: email and password
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
/*
*----------------------------------------------
*API for new user registration
*INPUT: username, email, Password, image_url, about_me
*OUTPUT: registered status
*----------------------------------------------
*/

router.post('/registration', function(req, res, next){
  var email = req.body.email;
  var password = req.body.password;
  var username = req.body.username;
  var image_url = req.body.image_url;
  var about_me = req.body.about_me;
  var arrFeilds = [username, email, password, image_url, about_me];
  async.waterfall([
    function (callback){
      useFunction.checkFeilds(res, arrFeilds, callback);
    },
    function (callback){
      checkUsername(res, username, callback);
    },
    function(callback){
      checkEmail(res, email, callback);
    }],
    function(error, result, next){
      if(error){
        var errorMsg = 'Error occour. Please Register again!';
        sendResponse.sendErrorMessage(errorMsg, res);
      }else {
        userModule.registration();
        sendResponse.sendSuccessData(arrFeilds, res);
      }
    });

});

/*
*----------------------------------------------------------------------
*This API is used check the eithr the username is available or not.
*Function Parameter: username
*----------------------------------------------------------------------
*/

function checkUsername(res, username, callback){
  userModule.checkUsername(username, function(result){
    if(result){
      var errorMsg = 'Username Already Exist';
      sendResponse.sendErrorMessage(errorMsg, res);
    }else{
      callback();
    }
  });
}

/*
*----------------------------------------------------------------------
*This API is used check the eithr the email is available or not.
*Function Parameter: email
*----------------------------------------------------------------------
*/

function checkEmail(res, email, callback){
  userModule.checkEmail(email, function(result){
    if(result){
      var errorMsg = 'Email Already Exist';
      sendResponse.sendErrorMessage(errorMsg, res);
    }else{
      callback();
    }
  });
}

module.exports = router;
