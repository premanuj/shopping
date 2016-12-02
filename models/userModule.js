var connection = require('./dbConnection');
var async = require('async');

module.exports.registration = function(arrUser, callback) {
    console.log('registration: ' + arrUser);
    var sql = "INSERT INTO user (username, email, password, image_url, access_token, verification_token, about_me) VALUES (?, ?, ?, ?, ?, ?, ?)";
    connection.query(sql, arrUser, function(error, rows) {
        if (error) {
            console.log(error);
            callback(false);
            return 1;
        } else {
            callback(true)
            return 0;
        }
    });
}

module.exports.verify_email = function(email, verification_token, callback) {
        var str = "<h2> Welcome to shopping ............ </h2>";
        str += "<p>Congratulation, You have created your account successfully.</p>";
        str += "<p>Get the best services </p>";
        str += "<p>Please click <a href = 'verification_url.com/" + verification_token + "'>This Link</a> to verify your account. </p>"
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
    connection.query(sql, email, function(err, emailRows, fields) {
        if (emailRows.length === 0) {
            callback(false);
        } else {
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
                                               basicUserInfo = {basicUserInfo: basicUserInfo};
                                               shoppingInfo = {shoppingInfo: nolist};
                                               var list = [];
                                               list.push(basicUserInfo);
                                               list.push(shoppingInfo);
                                               console.log(JSON.stringify(list));
                                               cb(list);
                                           } else {
                                             basicUserInfo = {basicUserInfo: basicUserInfo};
                                             shoppingInfo = {shoppingInfo: listRows};
                                            // callback(basicUserInfo);
                                             var list = [];
                                             list.push(basicUserInfo);
                                             list.push(shoppingInfo);
                                             console.log(JSON.stringify(list));
                                             cb(list);
                                           }
                                       }
                                   });

                    }
                });


    // async.parallel({
    //         listInfo: function(callback) {
    //             var shoppingList = [];
    //             connection.query(sql_profileInfo, id, function(err, listRows, fields) {
    //                 if (err) {
    //                     console.error('profileInfo err: ' + err);
    //                 } else {
    //                     if (listRows.length === 0) {
    //                         var nolist = {
    //                             order_list: 'No shopping list available for this user.'
    //                         };
    //                         callback(nolist);
    //                     } else {
    //                       console.log('test');
    //                       console.log(JSON.stringify(listRows[0]));
    //                       callback(JSON.stringify(listRows[0]));
    //                         // async.eachSeries(listRows, function(item, callback1) {
    //                         //         shoppingList.push(item);
    //                         //         callback1();
    //                         //     },
    //                         //     function(err) {
    //                         //         if (err) {
    //                         //             console.log('eachSerieserror:');
    //                         //             console.error(err);
    //                         //             callback1(false);
    //                         //         } else {
    //                         //             //console.log('shoppingInfo: ');
    //                         //           //  console.log(JSON.stringify(shoppingList));
    //                         //             callback(JSON.stringify(shoppingList));
    //                         //         }
    //                         //     });
    //                     }
    //                 }
    //             });
    //         },
    //         basicInfo: function(callback) {
    //             connection.query(sql_basicUserInfo, id, function(err, userRows, fields) {
    //                 if (userRows.length === 0) {
    //                     callback(false);
    //                 } else {
    //                     var basicUserInfo = {
    //                         user_id: userRows[0]['user_id'],
    //                         username: userRows[0]['username'],
    //                         email: userRows[0]['email'],
    //                         about_me: userRows[0]['about_me']
    //                     };
    //                     callback(basicUserInfo);
    //                 }
    //             });
    //         }
    //     },
    //     function(err, result) {
    //         if (err) {
    //             console.error("err:");
    //             console.error(err);
    //             cb(false);
    //         } else {
    //             //console.log(result[0][0]);
    //             //console.log(result[1]);
    //             console.log('is working');
    //             cb(result);
    //         }
    //     });

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
                usermame: loginRows[0]['username'],
                email: loginRows[0]['email'],
                access_token: loginRows[0]['access_token'],
                about_me: loginRows[0]['about_me'],
                image_url: loginRows[0]['image_url']
            };
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
