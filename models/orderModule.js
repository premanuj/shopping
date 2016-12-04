var connection = require('./dbConnection');
var async = require('async');
var sendResponse = require('../routes/sendResponse');

module.exports.neworder = function(arrOrder, callback) {
    var sql = "INSERT INTO shopping_list (items, store, notes, delivery_address, delivery_time_from, delivery_time_to, payment_type, estimated_weight, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(sql, arrOrder, function(err, orderResult) {
        if (err) {
            console.error(err);
            callback(false);
        } else {
          // var id = lastInsertId();
          // var client_id = arrOrder[8];
          // var date = new Date();
          // var sql_addOffer = 'INSERT INTO offer_list ()';
            callback(true);
        }
    });
}


module.exports.changeOrderStatus = function(arrStatus, callback) {

    var sql = "UPDATE shopping_list SET status = ? WHERE list_id = ? AND user_id = ?";
    connection.query(sql, arrStatus, function(err, orderStatus) {
        if (err) {
            console.error(err);
            callback(false);
        } else {
            console.log(orderStatus.message);
            callback(orderStatus.message);
        }
    });
}


module.exports.checkOrderStatus = function(arrToCheckStatus, callback) {
    console.log(arrToCheckStatus);
    var sql = "SELECT status FROM shopping_list WHERE list_id = ? AND user_id = ?";
    connection.query(sql, arrToCheckStatus, function(err, checkStatusRows, fields) {
        if (err) {
            console.error('Database Error: ');
            console.error(err);
            callback(false);
        } else {
            if (checkStatusRows.length === 0) {
                console.error('no rows selected');
                callback(false);
            } else {
                callback(checkStatusRows[0]['status']);
            }
        }
    });
}


module.exports.rateOrder = function(arrToRate, callback) {

    var sql = "UPDATE shopping_list SET rating = ? WHERE list_id = ? AND user_id = ?";
    connection.query(sql, arrToRate, function(err, rateOrder) {
        if (err) {

            console.error(err);
            callback(false);
        } else {
            console.log(rateOrder.message);
            callback(rateOrder.message);
        }
    });
}


module.exports.deleteOrder = function(arrFields, callback) {
    console.log(arrFields);
    var sql = "DELETE shopping_list, offer_list FROM shopping_list INNER JOIN offer_list ON shopping_list.list_id = offer_list.list_id WHERE shopping_list.list_id = ?";
    connection.query(sql, arrFields, function(error, deleteStatus) {
        if (error) {
            console.error(error);
            callback(false);
        } else {
            callback(true);
        }
    });
}

// module.exports.expireOfferStatus = function('', callback) {
//     var updateStaus = ['expire'];
//     var selectStatus = ['open'];
//
//     var sql_offerDate = "SELECT date FROM offer_list WHERE staus= ?";
//
//
//     connection.query(sql_offerDate, selectStatus, function(error, selectDateRows, fields) {
//         if (error) {
//             callback(false);
//         } else {
//             if (selectDateRows.length === 0) {
//                 console.error('no rows selected!');
//                 callback(false);
//             } else {
//                 var sql_offerStatusUpdate = 'UPDATE offer_list SET status = ?';
//                 async.eachSeries(selectDateRows, function(eachDate, callbackStatus) {
//                   if (eachDate) {
//
//                   }
//                   //  connection.query(sql_offerStatusUpdate, eachDate);
//                 });
//             }
//         }
//     });
//
// }

module.exports.orderOffer = function(arrOrder, callback) {
    var sql = "INSERT INTO offer_list (list_id, client_id, freelancer_id) VALUES (?, ?, ?)";

    connection.query(sql, arrOrder, function(error, result) {
        if (error) {
            console.error(error);
            callback(false);
        } else {
            callback(true);
        }
    });
}


module.exports.acceptOffer = function(arrOrder, callback) {
    var sql = "UPDATE offer_list SET status = ? WHERE offer_id = ? AND client_id = ?"; //change status of freelancer that has been accepted by user
    var sql_acceptUser =  "UPDATE offer_list SET status = ? WHERE offer_id = ? AND client_id = ? AND "//change status of user in offer_list table after he hires the freelancer.
    connection.query(sql, arrOrder, function(error, result) {
        if (error) {
            console.error(error);
            callback(false);
        } else {
            callback(true);
        }
    });
}


module.exports.progerssOrder = function(arrOrder, callback) {
    var sql = "UPDATE shopping_list SET status = ? WHERE list_id = ? AND user_id = ?";

    connection.query(sql, arrOrder, function(error, result) {
        if (error) {
            console.error(error);
            callback(false);
        } else {
            callback(true);
        }
    });
}


module.exports.checkOfferAcceptedStatus = function(list_id, callback) {
    var chkArray = [list_id, 'accepted'];
    var list_id = [list_id];
    console.log(chkArray);
    var sql = "SELECT status FROM offer_list WHERE list_id = ? AND status = ?";
    var sql_checkList = "SELECT * FROM offer_list WHERE list_id = ?";
    //var sql_clientAcceptStatus = "SELECT offer_id FROM offer_list WHERE list_id = ? LIMIT 1 ";
    var sql_clientAcceptStatus = "UPDATE offer_list SET status = 'accepted'  WHERE list_id = ? AND freelancer_id IS NULL ";

    connection.query(sql_checkList, list_id, function(error, checkList, fields) {
        if (error) {
            callback(false);
        } else {
            console.log('length:');
            console.log(checkList.length);
            if (checkList.length === 0) {
                callback(0);
                return;
            } else {

              connection.query(sql, chkArray, function(error, statusRows, fields) {
                  if (error) {
                      console.error('');
                      console.error(error);
                      callback(false);
                  } else {
                      console.log(statusRows.length);
                      if (statusRows.length === 0) {
                          console.log("is working");
                          connection.query(sql_clientAcceptStatus, list_id, function(error, idRows, fields){
                            if (error) {
                              console.error('no offer_id selected');
                              callback(false);
                            } else {
                              callback(true);
                            }
                          });
                      } else {
                          console.log(statusRows[0]);
                          callback(false);
                      }
                  }
              });



                // connection.query(sql, chkArray, function(error, statusRows, fields) {
                //     if (error) {
                //         console.error('');
                //         console.error(error);
                //         callback(false);
                //     } else {
                //         console.log(statusRows.length);
                //         if (statusRows.length === 0) {
                //             console.log("is working");
                //             callback(true);
                //         } else {
                //             console.log(statusRows[0]);
                //             callback(false);
                //         }
                //     }
                // });
            }
        }
    });
}

module.exports.finishOrder = function(arrOrder, callback){
  var list_id = arrOrder[1];
  var user_id = arrOrder[2];
  var openStatus = 'open';
  var expiredStatus = 'expired';
  var delOffer = [list_id, user_id, openStatus, expiredStatus];
  var sql = "UPDATE shopping_list SET status = ? WHERE list_id =? AND user_id = ?";
  var sql_delOffer = "DELETE FROM offer_list WHERE list_id = ? AND client_id= ? AND status  IN (?, ?) "
  connection.query(sql, arrOrder, function(error, statusRows, fields){
    if (error) {
      callback(false);
    }else {
      connection.query(sql_delOffer, delOffer, function(error, result){
        if (error) {
          console.error('Error in deletion:');
          console.error(error);
          callback(false);
        } else {
          console.log('success');
          console.log(result);
          callback(true);
        }
      });
    }
  });
}


module.exports.checkForFinishOrder = function(arrOrder, callback){
  var sql = "SELECT * FROM shopping_list WHERE list_id = ? AND status = ?";
  connection.query(sql, arrOrder, function(error, statusRows, fields){
    if (error) {
      console.log('ERROR:');
      console.error(error);
      callback(false);
    }else {
      if (statusRows.length===0) {
        console.log('not working');
        callback(false);
      } else {
      console.log('length');
      console.log(statusRows.length);
      callback(true);

      }
    }
  });
}

module.exports.clientReview = function(review, callback){
  var review_by_client = review[0];
  var client_id = review[1];
  var freelancer_id = review[2];
  var list_id = review[3];
  var arrReview = [review_by_client, list_id, client_id, freelancer_id];
  console.log(arrReview);
  var sql = "UPDATE offer_list SET review = ? WHERE list_id = ? AND client_id = ? AND freelancer_id = ?";
  connection.query(sql, arrReview, function(error, statusRows){
    if (error) {
      console.error(error);
      callback(false);
    }else {
      console.log(statusRows);
      callback(true);
    }
  });
}


module.exports.freelancerReview = function(review, callback){
  var review_by_freelancer = review[0];
  var client_id = review[1];
  var list_id = review[2];
  var arrReview = [review_by_freelancer, list_id, client_id];
  var sql = "UPDATE offer_list SET review = ? WHERE list_id = ? AND client_id = ? AND freelancer_id IS NULL";
  connection.query(sql, review, function(error, statusRows, fields){
    if (error) {
      console.error('updation failed!');
      console.error(error);
      callback(false);
    }else {
      console.log(statusRows);
      callback(true);
    }
  });
}


module.exports.checkFreelancer = function(arrFreelancer, callback){

  //ar arrReview = [review_by_freelancer, list_id, client_id];
  var sql = "SELECT * FROM offer_list WHERE list_id=? AND freelancer_id = ? ";
  connection.query(sql, arrFreelancer, function(error, statusRows, fields){
    if (error) {
      callback(false);
    }else {
      if (statusRows.length===0) {
        callback(true);
      } else {
        callback(false);
      }
    }
  });
}
