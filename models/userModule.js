var connection = require('./dbConnection');
var async = require('async');

module.exports.registration = function(arrUser, callback){
  var sql = "INSERT INTO user (username, email, password, image_url, access_token, verification_token, verification_status, about_me) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  connection.query(sql, arrUser, function(error, rows){
    if(error){
      console.log(error);
      callback(false);
      return 1;
    }else {
      callback(true)
      return 0 ;
    }
  });
}

module.exports.verify_email = function(email, verification_token, callback){
  var str = "<h2> Welcome to shopping ............ </h2>";
      str += "<p>Congratulation, You have created your account successfully.</p>";
      str += "<p>Get the best services </p>";
      str += "<p>Please click <a href = 'verification_url.com/"+verification_token+"'>This Link</a> to verify your account. </p>"
      str += "<p>Once you verify your account your account will be approve by our admin and then you will able to take all features of our services. </p>";
      str += "</br><strong>Thank You </strong>";
      var mailOption = {from: 'test mailer <testmailfornode@gmail.com>', to: email, subject: 'Please Verify your ccount', html: str};

      transporter.sendMail(mailOption, function(error, info){
        if(error){
          callback(false);
          return 1;
        }else {
          callback(true);
          return 0;
        }
      });

}
/*
*--------------------------------------------------
*Fetch all the existing user
*--------------------------------------------------
*/
module.exports.checkUsername = function(username, callback){
  var sql = "SELECT email FROM user WHERE username=?";
  connection.query(sql, username, function(err, usernameRows, fields){
    if(usernameRows.length===0){
      callback(false);
      return 1;
    }else{
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
module.exports.checkEmail = function(email, callback){
    var sql = "SELECT email FROM user WHERE email=?";
    connection.query(sql, email, function(err, emailRows, fields){
      if(emailRows.length===0){
        callback(false);
        return 1;
      }else{
        callback(true);
        return 0;
      }

    });
}

/*
*--------------------------------------------------
*Update user status to verify
*--------------------------------------------------
*/

module.exports.verifyUser = function(status){

}

/*
*--------------------------------------------------
*update user status to approved all the existing user
*--------------------------------------------------
*/

module.exports.approveUser = function(status){

}
