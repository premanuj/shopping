var express = require('express');
var router = express.Router();
var sendResponse = require('../routes/sendResponse');
var useFunction = require('../routes/useFunction');
var async = require('async');
var randomstring = require('just.randomstring');
var adminModule = require('../models/adminModule');

/*
*----------------------------------------------
*API for admin Login
*INPUT: adminName and Password
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
    }],
    function(error, result){
      sendResponse.sendSuccessData(arrFeilds, res);
    });

});

router.post('/approveUser', function(req, res, next){
  var admin_id = req.body.admin_id;
  var user_id = req.body.user_id;


  var arrfields = [admin_id, user_id];
  async.waterfall([
    function(callback){
      useFunction.checkFeilds(res, arrfields, callback);
    }],
    function(error, result){
      if (error) {
        var errorMsg = "Error Occured!";
        sendResponse.sendErrorMessage(errorMsg, res);
      } else {

        adminModule.verifyAdmin(admin_id, function(result){
          if (result===false) {
            var errorMsg = "Invalid Admin";
            sendResponse.sendErrorMessage(errorMsg, res);
          } else {
            adminModule.approveUser(arrfields, function(result){
              if (result==false) {
                var errorMsg = "This user cannot be approved.";
                sendResponse.sendErrorMessage(errorMsg, res);
              } else {
                var successMsg = "User approved successfully.";
                sendResponse.successStatusMsg(successMsg, res);
              }
            });
          }
        });


      }
  });
});

module.exports = router;
