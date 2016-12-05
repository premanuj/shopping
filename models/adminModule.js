var connection = require('./dbConnection');

function login(){

}

module.exports.approveUser = function(arrUser, callback){
  var user_id = arrUser[1];
  var statusRequest = 'request';
  var statusAccept = 'approved'
  var arrUpdate = [statusAccept, user_id, statusRequest];
//  var sql_requestUser = "SELECT user_id FROM user WHERE user_id = ? AND status = ?";
  var sql_acceptUser = "UPDATE user SET status = ? WHERE user_id = ? AND status = ? ";

  connection.query(sql_acceptUser, arrUpdate, function(error, result){
    if (error) {
      console.error(error);
      callback(false);
    } else {
      callback(true);
    }
  });
};


module.exports.verifyAdmin = function(admin_id, callback){
  var admin_id = [admin_id];
  var sql_verifyAdmin = "SELECT admin_id FROM admin WHERE admin_id = ?";

  connection.query(sql_verifyAdmin, admin_id, function(error, resultRows, fields){
    if (error) {
      console.error(error);
      callback(false);
    } else {
      if (resultRows===0) {
        callback(false);
      } else {
        callback(true);
      }
    }
  });
};
