var connection = require('./dbConnection');
var async = require('async');

module.exports.neworder = function(arrOrder, callback){
  var sql = "INSERT INTO shopping_list (items, store, notes, delivery_address, delivery_time_from, delivery_time_to, payment_type, estimated_weight, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  connection.query(sql, arrOrder, function(err, orderResult){
    if (err) {
      console.error(err);
      callback(false);
    }else {
      callback(true);
    }
  });
}


module.exports.changeOrderStatus = function(arrStatus, callback){

  var sql = "UPDATE shopping_list SET status = ? WHERE list_id = ? AND user_id = ?";
  connection.query(sql, arrStatus, function(err, orderStatus){
    if (err) {
      console.error(err);
      callback(false);
    }else {
      console.log(orderStatus.message);
      callback(orderStatus.message);
    }
  });
}


module.exports.checkOrderStatus = function(arrToCheckStatus, callback){
console.log(arrToCheckStatus);
  var sql = "SELECT status FROM shopping_list WHERE list_id = ? AND user_id = ?";
  connection.query(sql, arrToCheckStatus, function(err, checkStatusRows, fields){
    if (err) {
        console.error('Database Error: ');
      console.error(err);
      callback(false);
    }else {
      if (checkStatusRows.length===0) {
        console.error('no rows selected');
        callback(false);
      }else {
        // console.log(checkStatusRows[0]);
        // if (checkStatusRows[0]['status']==='finish') {
        //   callback(true);
        // }else {
        //   callback(false);
        callback(checkStatusRows[0]['status']);
      //  }
      }
    }
  });
}


module.exports.rateOrder = function(arrToRate, callback){

  var sql = "UPDATE shopping_list SET rating = ? WHERE list_id = ? AND user_id = ?";
  connection.query(sql, arrToRate, function(err, rateOrder){
    if (err) {

      console.error(err);
      callback(false);
    }else {
      console.log(rateOrder.message);
      callback(rateOrder.message);
    }
  });
}


module.exports.deleteOrder = function(arrFields, callback){
  console.log(arrFields);
  var sql = "DELETE shopping_list, offer_list FROM shopping_list INNER JOIN offer_list ON shopping_list.list_id = offer_list.list_id WHERE shopping_list.list_id = ?";
  connection.query(sql, arrFields, function(error, deleteStatus){
    if (error) {
      console.error(error);
      callback(false);
    }else {
      callback(true);
    }
  });
}
