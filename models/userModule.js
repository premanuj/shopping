var connection = require('./dbConnection');
var async = require('async');

module.exports.registration = function(arrUser, callback) {
    var sql = "INSERT INTO user (username, email, password, image_url, access_token, verification_token) VALUES (?, ?, ?, ?, ?, ?)";
    connection.query(sql, arrUser, function(error, rows) {
        if (error) {
            console.log(error);
            callback(false);
        } else {
            callback(true)
        }
    });
}

module.exports.verify_email = function(email, verification_token, callback) {
  // if (account==='new') {
  //   account='user_verification';
  // }else {
  //   account = 'reset_passwordLink';
  // }
    var str = "<h2> Welcome to shopping ............ </h2>";
    str += "<p>Congratulation, You have created your account successfully.</p>";
    str += "<p>Get the best services </p>";
    str += "<p>Please click <a href = 'http://127.0.0.1:3030/user/user_verification/?verification_token=" + verification_token + "'>This Link</a> to verify your account. </p>"
    str += "<p>Once you verify your account your account will be approve by our admin and then you will able to take all features of our services. </p>";
    str += "</br><strong>Thank You </strong>";
    var mailOption = {
        from: 'test mailer <testmailfornode@gmail.com>',
        to: email,
        subject: 'Please Verify your ccount',
        html: str
    };

    transporter.sendMail(mailOption, function(error, info) {
        if (error) {
            console.error(error);
            callback(false);
        } else {
            callback(true);

        }
    });

}

module.exports.user_verification = function(verification_token, status, callback) {
      //  var sql = "SELECT user_id FROM user WHERE verification_token = ? AND verification_status = '0'";
        var sql_verificaion = "UPDATE user SET verification_status = ? WHERE verification_token = ?";
        var arrVerification = [status, verification_token];
        connection.query(sql_verificaion, arrVerification, function(error, result) {
            if (error) {
                callback(false);
            } else {
                callback(true);
            }
        });
    }


module.exports.about_me = function(arrAbout, callback) {
        var sql_verificaion = "UPDATE user SET about_me = ? WHERE user_id = ?";
        connection.query(sql_verificaion, arrAbout, function(error, result) {
            if (error) {
                callback(false);
            } else {
                callback(true);
            }
        });
    }
    /*
     *--------------------------------------------------
     *Fetch all the existing user
     *--------------------------------------------------
     */
module.exports.checkUsername = function(username, callback) {
    var sql = "SELECT email FROM user WHERE username=?";
    connection.query(sql, username, function(err, usernameRows, fields) {
        if (usernameRows.length === 0) {
            callback(false);
            return 1;
        } else {
            callback(true);
            return 0;
        }
    });
}

/*
 *--------------------------------------------------
 *Fetch all the existing email
 *--------------------------------------------------
 */
module.exports.checkEmail = function(email, callback) {
    var sql = "SELECT email FROM user WHERE email=?";
    connection.query(sql, email, function(error, emailRows, fields) {
      if (error) {
        console.error('error in fetching email:');
        console.error(error);
        callback(false);
      } else {
        if (emailRows.length === 0) {
            callback(false);
        } else {
            callback(true);
        }
      }


    });
}


/*
 *--------------------------------------------------
 *Send reset password link
 *--------------------------------------------------
 */
module.exports.sendResetPasswordLink = function(email, verification_token, callback) {
  var str = "<h2> Welcome to shopping ............ </h2>";
  str += "<p>You had requested to reset password for your account with email: "+email+".</p>";
  str += "<p>Get the best services </p>";
  str += "<p>Please click <a href = 'http://127.0.0.1/Updated/reset-password.php?verification_token=" + verification_token + "'>This Link</a> to verify your account. </p>"
  str += "<p>Once you verify your account your account will be you will be redirected to password reset page. </p>";
  str += "</br><strong>Thank You </strong>";
  var mailOption = {
      from: 'test mailer <testmailfornode@gmail.com>',
      to: email,
      subject: 'Please Reset your account',
      html: str
  };
  var updateVerificationToken = [verification_token, email];
  var sql_updateVerificationToken = "UPDATE user SET verification_token = ? , verification_status = '2' WHERE email = ?";

  connection.query(sql_updateVerificationToken, updateVerificationToken, function(error, result){
    if (error) {
      var errorMsg = "Failed to send reset password link.";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      console.log('token:');
      console.log(result);
      transporter.sendMail(mailOption, function(error, info) {
          if (error) {
              console.error(error);
              callback(false);
          } else {
              callback(true);

          }
      });
    }
  });
}

module.exports.updatePassword = function(arrPassword, callback){
  var sql_updatePassword = "UPDATE user SET password = ?, verification_status = ? WHERE verification_token = ?";
  console.log(arrPassword);
  connection.query(sql_updatePassword, arrPassword, function(error, result){
    if (error) {
      console.error(error);
      callback(false);
    } else {
      console.log(result);
      callback(true);
    }
  });
}


/*
 *--------------------------------------------------
 *Fetch user profile: user_id, username, email, about_me, client_review, freelancer_review
 *--------------------------------------------------
 */
module.exports.userProfile = function(id, cb) {
    id = [id];
    var sql_basicUserInfo = "SELECT * FROM user WHERE user_id=?";
    var sql_profileInfo = "SELECT sl.user_id, sl.items, sl.status, ol.review from shopping_list as sl INNER JOIN offer_list as ol ON sl.user_id = ol.client_id WHERE ol.client_id = ?  GROUP BY sl.list_id";

    var shoppingList = [];
    connection.query(sql_basicUserInfo, id, function(err, userRows, fields) {
        if (userRows.length === 0) {
            cb(false);
        } else {
            var basicUserInfo = {
                user_id: userRows[0]['user_id'],
                username: userRows[0]['username'],
                email: userRows[0]['email'],
                about_me: userRows[0]['about_me']
            };
            connection.query(sql_profileInfo, id, function(err, listRows, fields) {
                if (err) {
                    console.error('profileInfo err: ' + err);
                } else {
                    if (listRows.length === 0) {
                        var nolist = {
                            order_list: 'No shopping list available for this user.'
                        };
                        basicUserInfo = {
                            basicUserInfo: basicUserInfo
                        };
                        shoppingInfo = {
                            shoppingInfo: nolist
                        };
                        console.log(JSON.stringify(list));
                        //list = JSON.stringify(list);
                        cb(list);
                    } else {
                        basicUserInfo = {
                            basicUserInfo: basicUserInfo
                        };
                        shoppingInfo = {
                            shoppingInfo: listRows
                        };
                        console.log('rows');
                        console.log(listRows.length);
                         var list = { "user_info": basicUserInfo.basicUserInfo, "shoppingInfo": shoppingInfo.shoppingInfo, "test": "trsdd" };
                        console.log(JSON.stringify(list));
                        cb(list);
                    }
                }
            });

        }
    });
}

/*
 *--------------------------------------------------
 *This check the user details for login
 *--------------------------------------------------
 */

module.exports.loginUser = function(loginInfo, callback) {
    console.log('LoginInfo:' + loginInfo);
    console.log('LoginInfo-arry:' + loginInfo);
    var sql = "SELECT * FROM user WHERE email=? AND password=?";
    connection.query(sql, loginInfo, function(err, loginRows, fields) {
        if (loginRows.length === 1) {
            var data = {
                user_id: loginRows[0]['user_id'],
                username: loginRows[0]['username'],
                email: loginRows[0]['email'],
                access_token: loginRows[0]['access_token'],
                about_me: loginRows[0]['about_me'],
                image_url: loginRows[0]['image_url']
            };
            console.log('working');
            callback(data)
        } else {
            console.error(err);
            callback(false);
        }
    });
}


/*
 *--------------------------------------------------
 *Update user status to verify
 *--------------------------------------------------
 */

module.exports.verifyUser = function(status) {

}

/*
 *--------------------------------------------------
 *update user status to approved all the existing user
 *--------------------------------------------------
 */

module.exports.approveUser = function(status) {

}
