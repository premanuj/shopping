var express = require('express');
var router = express.Router();
var sendResponse = require('../routes/sendResponse');
var useFunction = require('../routes/useFunction');
var async = require('async');
var orderModule = require('../models/orderModule');

/*
*---------------------------------------------------------------------------------------------------------
*This API is used to do a new order by existing userModule
*INPUT: user_id, lists, store, notes, delivery_address, delivery_time_from, delivery_time_to, payment_type, estimated_weight
*OUTPUT: Order success meassage
*-----------------------------------------------------------------------------------------------------------
*/

router.post('/neworder', function(req, res, next){
  var user_id = req.body.user_id;
  var items = req.body.items;
  var store = req.body.store;
  var notes = req.body.notes;
  var delivery_address = req.body.delivery_address;
  var delivery_time_from = req.body.delivery_time_from;
  var delivery_time_to = req.body.delivery_time_to;
  var payment_type = req.body.payment_type;
  var estimated_weight = req.body.estimated_weight;

  var arrFields = [items, store, notes, delivery_address, delivery_time_from, delivery_time_to, payment_type, estimated_weight, user_id]
  async.waterfall([
    function(callback){
      useFunction.checkFeilds(res, arrFields, callback);
    }
    ],
    function(error, result){
      if(error){
        var errorMsg = "Unable to do a new order for this user.";
        sendResponse.sendErrorMessage(errorMsg, res);
      }else {
        var counter = 0;
        async.eachSeries(items, function(eachItem, callbackItem){

        })
        // orderModule.neworder(arrFields, function(result){
        //   if (result===false) {
        //     var errorMsg = "Error Occured!";
        //     sendResponse.sendErrorMessage(errorMsg, res);
        //   }else {
        //     var successMsg = 'Items Added Successfully!';
        //     sendResponse.successStatusMsg(successMsg, res);
        //   }
        // });
      }
    });
});

/*
*---------------------------------------------------------------------------------------------------
*This API is used to change the order status by the user
*INPUTS: user_id, list_id
*OUTPUT: change active status to
*----------------------------------------------------------------------------------------------------
*/

router.post('/changeOrderStatus', function(req, res, next){
  var list_id = req.body.list_id;
  var user_id = req.body.user_id;
  var status = req.body.status;

  var arrFields = [status, list_id, user_id];
console.log(arrFields);
async.waterfall([
  function(callback){
    useFunction.checkFeilds(res, arrFields, callback);
  }],
  function(error, result){
    if (error) {
      var errorMsg = "Unable to change the order status";
      sendResponse.sendErrorMessage(errorMsg, res);
    }else {
      orderModule.changeOrderStatus(arrFields, function(getResult){
        if (getResult==false) {
          var errorMsg = "Error Encoured!";
          sendResponse.sendErrorMessage(errorMsg, res);
        }else {
          var successMsg = "Status change to "+ status + "successfully!";
          sendResponse.successStatusMsg(getResult, res);
        }
      });
    }
  });
});

/*
*---------------------------------------------------------------------------------------------------
*This API is used to change the rate the order by the user after the status is changed to finshed.
*INPUTS: user_id, list_id, rate
*OUTPUT: change active status to
*----------------------------------------------------------------------------------------------------
*/

router.post('/rateOrder', function(req, res, next){
  var list_id = req.body.list_id;
  var user_id = req.body.user_id;
  var rate = req.body.rate;

  var arrToCheckStatus = [list_id, user_id];
  var arrToRate = [rate, list_id, user_id];

  async.waterfall([
    function(callback){
      useFunction.checkFeilds(res, arrToRate, callback);
    }],
    function(error, result){
      if (error) {
        console.log(error);
        var errorMsg = "Error Occoured!";
        sendResponse.sendErrorMessage(errorMsg, res);
      }else {
        orderModule.checkOrderStatus(arrToCheckStatus, function(result){
          if (result===false) {
            var errorMsg = "Only the status with 'Finished' can rated the order";
            sendResponse.sendErrorMessage(errorMsg, res);
          }else {
            if (result==='finish') {
              orderModule.rateOrder(arrToRate, function(result){
                if(result===false){
                  var errorMsg = "Order cannot be rated! ";
                  sendResponse.sendErrorMessage(errorMsg, res);
                }else {
                  var successMsg = "Order rated to "+rate+" successfully!"
                  sendResponse.successStatusMsg(successMsg, res);
                }
              });
            }else {
              var errorMsg = "Only order having status 'finished' can be changed."
              sendResponse.sendErrorMessage(errorMsg, res);
            }
          }
        });
      }
    }
  );
});

/*
*---------------------------------------------------------------------------------------------------
*This API is used to deactivate an order status
*INPUTS: user_id, list_id, status
*OUTPUT: change active status to
*----------------------------------------------------------------------------------------------------
*/

router.post('/deleteOrder', function(req, res, next){
  var user_id = req.body.user_id;
  var list_id = req.body.list_id;
//  var status = req.bosy.status;

  var arrFields = [list_id, user_id];
  var delOrder = [list_id];

  async.waterfall([
    function(callback){
      useFunction.checkFeilds(res, arrFields, callback);
    }],
    function(error, result){
      if (error) {
        var errorMsg = "Error Occured!!!";
        sendResponse.sendErrorMessage(errorMsg, res);
      }else {
        orderModule.checkOrderStatus(arrFields, function(result){
          if (result===false) {
            var errorMsg = "orderstatus: Order cannot be deleted!!!";
            sendResponse.sendErrorMessage(errorMsg, res);
          }else {
            if (result==='active' || result === 'deactive') {
              orderModule.deleteOrder(delOrder, function(result){
                if (result===false) {
                  var errorMsg = "deleteStatus: Order Cannot be Deleted!!!"
                  sendResponse.sendErrorMessage(errorMsg, res);
                }else {
                  var successMsg = "Order Deleteted Successfully!!!";
                  sendResponse.successStatusMsg(successMsg, res);
                }
              });
            }else {
              var errorMsg = "Only active and deactive order can be deleted!"
              sendResponse.sendErrorMessage(errorMsg, res);
            }

          }
        });
      }
    }
  );
});


/*
*---------------------------------------------------------------------------------------------------
*This API is used to deactivate an order status
*INPUTS: user_id, list_id, status
*OUTPUT: change active status to
*----------------------------------------------------------------------------------------------------
*/


router.post('/orderOffer', function(req, res, next){
  var list_id = req.body.list_id;
  var freelancer_id = req.body.user_id;
  var
});


/*
*---------------------------------------------------------------------------------------------------
*This API is used to deactivate an order status
*INPUTS: user_id, list_id, status
*OUTPUT: change active status to
*----------------------------------------------------------------------------------------------------
*/


router.post('/acceptOffer', function(req, res, next){
  var
});

module.exports = router;
