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
          console.log();
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
    //var sql_profileInfo = "SELECT sl.user_id, sl.list_name, sl.items, sl.status, ol.review FROM shopping_list as sl INNER JOIN offer_list as ol ON sl.user_id = ol.client_id WHERE sl.user_id = ?";
      var sql_profileInfo = "SELECT user_id, list_name, items, status FROM shopping_list WHERE user_id = ?";
      var sql_profileOffer = "SELECT review FROM offer_list WHERE freelancer_id = ? AND freelancer_id IS NOT NULL";
    var shoppingList = [];
    connection.query(sql_basicUserInfo, id, function(err, userRows, fields) {
        if (userRows.length === 0) {
            cb(false);
        } else {
          var list = [];
            var basicUserInfo = {
                user_id: userRows[0]['user_id'],
                username: userRows[0]['username'],
                email: userRows[0]['email'],
                about_me: userRows[0]['about_me']
            };
            basicUserInfo = {"basicUserInfo": basicUserInfo}
            list.push(basicUserInfo);
            connection.query(sql_profileInfo, id, function(err, shoppingRows, fields) {
                if (err) {
                    console.error('profileInfo err: ' + err);
                    cb(false);
                } else {
                //  console.log(shoppingRows[0]);
                  var shoppingUserInfo = {"shoppingUserInfo":shoppingRows};
                  console.log(shoppingUserInfo);
                  list.push(shoppingUserInfo);

                  connection.query(sql_profileOffer, id, function(error, offerRows, fields){
                    if (error) {
                      cb(false)
                    } else {
                      var offerUserInfo = {"offerRows":offerRows};
                      list.push(offerUserInfo.offerRows);
                      console.log(list);
                      //var list = {"user_info": basicUserInfo, "shoppingInfo": shoppingUserInfo[0], "offer_info": offerUserInfo};
                      cb(list);
                    }
                  });
                }
            });

        }
    });
}

/*
 *------------------------------------------
 *This check the valid user_id
 *-------------------------------------------
 */

 module.exports.checkUserId = function(user_id, callback){
   var sql = "SELECT * FROM user WHERE user_id = ?";
   connection.query(sql, user_id, function(error, resultRows, fields){
     if (error) {
       console.error(error);
     } else {
       if(resultRows===0){
         callback(false);
       }else {
         callback(true);
       }
     }
   });
 }

/*
 *------------------------------------------
 *This is used to post testimonials
 *-------------------------------------------
 */

 module.exports.testimonials = function(arrTestimonials, callback){
   var sql = "INSERT INTO testimonials (content, status, image_url) VALUES (?, ?, ?)";
   connection.query(sql, arrTestimonials, function(error, resultRows, fields){
     if (error) {
       console.log("errrrr00000000rrrr");
       console.error(error);
       callback(false);
     } else {
       console.log("workingggggggggggg............");
       if(resultRows.length===0){
         callback(false);
       }else {
         callback(true);
       }
     }
   });
 }

/*
 *------------------------------------------
 *This is used to get testimonials
 *-------------------------------------------
 */

 module.exports.getTestimonials = function(callback){
   var sql = "SELECT * FROM testimonials";
   connection.query(sql, function(error, resultRows, fields){
     if (error) {
       console.log("errrrr00000000rrrr");
       console.error(error);
       callback(false);
     } else {
       callback(resultRows)
     }
   });
 }

module.exports.deleteTestimonials = function(id, callback){
  var sql_deleteTestimonials = "Delete from testimonials where t_id = ?";
  connection.query(sql_deleteTestimonials, id, function(error, result){
    if (error) {
      callback(false);
    }else {
      callback(true);
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
