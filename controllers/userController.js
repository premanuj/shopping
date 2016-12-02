var express = require('express');
var router = express.Router();
var sendResponse = require('../routes/sendResponse');
var useFunction = require('../routes/useFunction');
var async = require('async');
var randomstring = require('just.randomstring');
var userModule = require('../models/userModule');
var md5 = require('md5');


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
 *OUTPUT: Login status ie. either success or failed to login
 *----------------------------------------------
 */

router.post('/login', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    password = md5(password);
    var arrFeilds = [email, password];
    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrFeilds, callback);
            }
        ],
        function(error, result, next) {
            userModule.loginUser(arrFeilds, function(result) {
                if (result === false) {
                    var errorMsg = 'Email or password is invalid.'
                    sendResponse.sendErrorMessage(errorMsg, res);

                } else {
                    sendResponse.sendSuccessData(result, res);
                }
            });

        });

});


/*
 *----------------------------------------------
 *API for new user registration
 *INPUT: username, email, Password, image_url, about_me
 *OUTPUT: registered status
 *----------------------------------------------
 */

router.post('/registration', function(req, res, next) {
    //receiving form fields
    var email = req.body.email;
    var password = req.body.password;
    var username = req.body.username;
    var image_url = req.body.image_url;
    var about_me = req.body.about_me;
    var arrFeilds = [username, email, password, image_url, about_me];

    var access_token;
    var verification_token;
    var verification_status
    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrFeilds, callback);
            },
            function(callback) {
                checkUsername(res, username, callback);
            },
            function(callback) {
                checkEmail(res, email, callback);
            }
        ],
        function(error, result, next) {
            if (error) {
                var errorMsg = 'Error occour. Please Register again!';
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {
                async.parallel([
                        /*
                         *-----------------------------------------------------------------
                         *Code for encryption of password, access_token, verification_token
                         *Applied For: password, access_token, verification_token
                         */
                        function(callback) {
                            //Encryption for password
                            callback(password);

                        },
                        function(callback) {
                            //Encryption for access_token
                            bcrypt.genSalt(passwordRounds, function(err, salt) {
                                bcrypt.hash(myPlaintextPassword, salt, function(err, access_token) {
                                    callback(null, access_token);
                                });
                            });
                        },
                        function(callback) {
                            //Encryption for verification_token
                            bcrypt.genSalt(passwordRounds, function(err, salt) {
                                bcrypt.hash(myPlaintextPassword, salt, function(err, verification_token) {
                                    callback(null, verification_token);
                                });
                            });
                        }
                    ],
                    function(err, results) {
                        password = results[0];
                        access_token = results[1];
                        verification_token = results[2];
                        var sendInputs = [username, email, password, image_url, access_token, verification_token, about_me];
                        userModule.registration(sendInputs, function(result) {
                            if (result) {
                                userModule.verify_email(email, verification_token, function(emailstatus) {
                                    if (emailstatus) {
                                        var successMsg = "Message sent successfully."
                                        console.log(successMsg);
                                        sendResponse.successStatusMsg(successMsg, res);
                                    } else {
                                        errorMsg = "It seems email is not valid"
                                        sendResponse.sendErrorMessage(errorMsg, res);
                                    }
                                });
                            } else {
                                errorMsg = "User Registration Failed!";
                                sendResponse.sendErrorMessage(errorMsg, res);
                            }
                        });
                    });
            }
        });

});

/*
 *----------------------------------------------------------------------
 *This API is get user Profile
 *INPUT: user_id
 OUTPUT: user_id, username, email, about_me, client_review, freelance_review
 *----------------------------------------------------------------------
 */
router.get('/userprofile', function(req, res){
  var user_id = req.query.user_id;
  userModule.userProfile(user_id, function(result){
    if (result==false) {
      var errorMsg = "User does not exist!.";
      console.error(errorMsg);
      sendResponse.sendErrorMessage(errorMsg, res);
    }else{
      console.log('Success: '+result);
      sendResponse.sendSuccessData(result, res)
    }
  });
});



/*
 *----------------------------------------------------------------------
 *This API is used check the eithr the username is available or not.
 *Function Parameter: username
 *----------------------------------------------------------------------
 */

function checkUsername(res, username, callback) {
    userModule.checkUsername(username, function(result) {
        if (result) {
            var errorMsg = 'Username Already Exist';
            sendResponse.sendErrorMessage(errorMsg, res);
        } else {
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

function checkEmail(res, email, callback) {
    userModule.checkEmail(email, function(result) {
        if (result) {
            var errorMsg = 'Email Already Exist';
            sendResponse.sendErrorMessage(errorMsg, res);
        } else {
            callback();
        }
    });
}

module.exports = router;
