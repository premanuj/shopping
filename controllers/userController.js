var express = require('express');
var router = express.Router();
var sendResponse = require('../routes/sendResponse');
var useFunction = require('../routes/useFunction');
var async = require('async');
var randomstring = require('just.randomstring');
var userModule = require('../models/userModule');
var md5 = require('md5');
var multer = require('multer');
var upload = multer({
    dest: 'uploads/'
});


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
                    var successMsg = 'You are successfully Logged in.';
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

router.post('/registration', upload.single('image_url'), function(req, res, next) {
    //receiving form fields
    var email = req.body.email;
    var password = req.body.password;
    var username = req.body.username;
    var image_url = req.file.filename;
    var about_me = req.body.about_me;
    password = md5(password);
    var arrFeilds = [username, email, password, image_url];

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
                            callback(null, password);

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
                                var account = 'new';
                                userModule.verify_email(email, verification_token, function(emailstatus) {
                                    if (emailstatus) {
                                        var successMsg = "User registered successfully."
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
 *This API is to verify the user email
 *INPUT: verification_token
  OUTPUT:
 *----------------------------------------------------------------------
 */

router.get('/user_verification', function(req, res) {
    var verification_token = req.query.verification_token;
    var status = '1';
    userModule.user_verification(verification_token, status, function(result) {
        if (result === false) {
            var errorMsg = "Email verification failed!!!";
            sendResponse.sendErrorMessage(errorMsg, res);
        } else {
            var successMsg = "Email verification Successfull";
            sendResponse.successStatusMsg(successMsg, res);
        }
    });

});

/*
 *----------------------------------------------------------------------
 *This API is used to reset password
 *INPUT: verification_token
  OUTPUT:
 *----------------------------------------------------------------------
 */

router.get('/resetPassword', function(req, res) {
    var email = req.query.email;
    console.log("email");
    console.log(email);
    userModule.checkEmail(email, function(result) {
        if (result === false) {
            var errorMsg = "Invalid Email.";
            sendResponse.sendErrorMessage(errorMsg, res);
        } else {
            var key = email + new Date();
            async.parallel([
                    function(callback) {
                        //Encryption for verification_token
                        bcrypt.genSalt(passwordRounds, function(err, salt) {
                            bcrypt.hash(key, salt, function(err, new_token) {
                                callback(null, new_token);
                            });
                        });
                    }
                ],
                function(error, result) {
                    if (error) {
                        var errorMsg = 'Error occour during encryption';
                        send.sendErrorMessage(errorMsg, res);
                    } else {
                        var verification_token = result[0];
                        console.log('token: ');
                        console.log(verification_token);
                        userModule.sendResetPasswordLink(email, verification_token, function(result) {
                            if (result === false) {
                                var errorMsg = 'Unable to send email for reset password'.
                                sendResponse.sendErrorMessage(errorMsg, res);
                            } else {

                                var successMsg = "Reset password link is successfully sent to email address of user.";
                                sendResponse.successStatusMsg(successMsg, res);
                            }
                        });
                    }

                }
            );
        }
    });

});

/*
 *----------------------------------------------------------------------
 *This API is to reset password by user through the email link
 *INPUT: verification_token
  OUTPUT:
 *----------------------------------------------------------------------
 */

router.get('/reset_passwordLink', function(req, res) {
    var verification_token = req.query.verification_token;
    var successData = {
        verification_token: verification_token
    };
    sendResponse.sendSuccessData(successData, res);
    // var password = req.body.password;
    // password = md5(password);
    // var status = '1';
    // var arrPassword = [password, status, verification_token];
    // userModule.updatePassword(arrPassword, function(result) {
    //     if (result === false) {
    //         var errorMsg = "Email verification failed!!!";
    //         sendResponse.sendErrorMessage(errorMsg, res);
    //     } else {
    //         var successMsg = "Password reset successully.";
    //         sendResponse.successStatusMsg(successMsg, res);
    //     }
    // });
});

router.post('/updatePassword', function(req, res) {
    var verification_token = req.body.verification_token;
    var password = req.body.password;
    var status = '1';
    console.log('password: ' + password);
    password = md5(password);
    var arrPassword = [password, status, verification_token];
    userModule.updatePassword(arrPassword, function(result) {
        if (result === false) {
            var errorMsg = "Email verification failed!!!";
            sendResponse.sendErrorMessage(errorMsg, res);
        } else {
            var successMsg = "Password reset successully.";
            sendResponse.successStatusMsg(successMsg, res);
        }
    });
});
/*
 *----------------------------------------------------------------------
 *This API is to post about_me by existing user
 *INPUT: verification_token
  OUTPUT:
 *----------------------------------------------------------------------
 */

router.post('/about_me', function(req, res) {
    var user_id = req.body.user_id;
    var about_me = req.body.about_me;
    var arrAbout = [about_me, user_id];
    userModule.about_me(arrAbout, function(result) {
        if (result === false) {
            var errorMsg = "Email verification failed!!!";
            sendResponse.sendErrorMessage(errorMsg, res);
        } else {
            var successMsg = "Email verification Successfull";
            sendResponse.successStatusMsg(successMsg, res);
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
router.get('/userprofile', function(req, res) {
    var user_id = req.query.user_id;
    userModule.userProfile(user_id, function(result) {
        if (result == false) {
            var errorMsg = "User does not exist!.";
            console.error(errorMsg);
            sendResponse.sendErrorMessage(errorMsg, res);
        } else {
            console.log('Success: ' + result);
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
