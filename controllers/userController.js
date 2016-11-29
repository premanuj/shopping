var express = require('express');
var router = express.Router();
var sendResponse = require('../routes/sendResponse');
var useFunction = require('../routes/useFunction');
var async = require('async');
var randomstring = require('just.randomstring');
var userModule = require('../models/userModule');


/*module for secure encryption */

var bcrypt = require('bcrypt');
  const passwordRounds = 10;
  const tokenRounds = 32;
  const verificationRounds = 64;
  const myPlaintextPassword = 'd0/\/\P4$$w0rD';
  const someOtherPlaintextPassword = 'not_bacon';
/*End of encryption */

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
    },
    function (callback){
      checkEmail(res, email, callback);
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
  //receiving form fields
  var email = req.body.email;
  var password = req.body.password;
  var username = req.body.username;
  var image_url = req.body.image_url;
  var about_me = req.body.about_me;
  var arrFeilds = [username, email, password, image_url, about_me];

  var access_token;
  var verification_token;
  var verification_status = "active";

/*
*-----------------------------------------------------------------
*Code for encryption of password, access_token, verification_token
*Applied For: password, access_token, verification_token
*/

  //Encryption for password
  bcrypt.genSalt(passwordRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        password = hash;
        console.log('This is password: '+password);
    });
  });

  //Encryption for access_token
  bcrypt.genSalt(tokenRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        access_token = hash;
    });
  });

  //Encryption for verification_token
  bcrypt.genSalt(verificationRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        verification_token = hash;
    });
  });
  console.log("password "+password);
  var action = 'login'
  async.waterfall([
    function (callback){
      useFunction.checkFeilds(res, arrFeilds, callback);
    },
    function (callback){
      checkUsername(res, username, action, callback);
    },
    function(callback){
      checkEmail(res, email, action, callback);
    }],
    function(error, result, next){
      if(error){
        var errorMsg = 'Error occour. Please Register again!';
        sendResponse.sendErrorMessage(errorMsg, res);
      }else {
        var sendInputs = [username, email, password, image_url, access_token, verification_token, verification_status, about_me];
        userModule.registration(sendInputs, function(result){
          if(result){
            userModule.verify_email(email, verification_token, function(emailstatus){
              if(emailstatus){
                var successMsg = "Message sent successfully."
                sendResponse.successStatusMsg(successMsg, res);
              }else{
                errorMsg = "It seems email is not valid"
                sendResponse.sendErrorMessage(errorMsg, res);
              }
            });
          }else{
            errorMsg = "User Registration Failed!";
            sendResponse.sendErrorMessage(errorMsg, res);
          }
        });
      }
    });

});

/*
*----------------------------------------------------------------------
*This API is used check the eithr the username is available or not.
*Function Parameter: username
*----------------------------------------------------------------------
*/

function checkUsername(res, username, action, callback){
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

function checkEmail(res, email, action, callback){
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
