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

router.post('/login', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var arrFeilds = {
        email,
        password
    };
    console.log('is working');
    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrFeilds, callback);

          }],
        function(error, result) {
            sendResponse.sendSuccessData(arrFeilds, res);
        });
});

/*
 *----------------------------------------------
 *API is used by admin to approve User
 *INPUT: admin_id, user_id
 *OUTPUT: approve status
 *----------------------------------------------
 */

router.post('/approveUser', function(req, res, next) {
    var admin_id = req.body.admin_id;
    var user_id = req.body.user_id;

    var arrfields = [admin_id, user_id];
    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrfields, callback);
            }
        ],
        function(error, result) {
            if (error) {
                var errorMsg = "Error Occured!";
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {

                adminModule.verifyAdmin(admin_id, function(result) {
                    if (result === false) {
                        var errorMsg = "Invalid Admin";
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        adminModule.approveUser(arrfields, function(result) {
                            if (result == false) {
                                var errorMsg = "This user did not verifiy email.";
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


/*
 *----------------------------------------------
 *API is used by admin to view all the list of users
 *INPUT: admin_id
 *OUTPUT: lists all the user
 *----------------------------------------------
 */

router.get('/viewUsers', function(req, res, next) {
    var admin_id = req.query.admin_id;
    var arrAdmin = [admin_id];
    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, admin_id, callback);
            }
        ],
        function(error, result) {
            if (error) {
                var errorMsg = "Error occured";
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {
                adminModule.verifyAdmin(admin_id, function(result) {
                    if (result === false) {
                        var errorMsg = "Unauthorized access!"
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        adminModule.viewUsers(admin_id, function(result) {
                            if (result === false) {
                                var errorMsg = "No list available";
                                sendResponse.sendErrorMessage(errorMsg, res);
                            } else {
                                sendResponse.sendSuccessData(result, res);
                            }
                        });
                    }
                });

            }
        });
});

/*
 *----------------------------------------------
 *API is used by admin to view all the order done by specific user
 *INPUT: user_id, admin_id
 *OUTPUT: list all the order done by single user
 *----------------------------------------------
 */
router.get('/viewSpecificUserOrder', function(req, res, next) {
    var admin_id = req.query.admin_id;
    var user_id = req.query.user_id;
    var arrAdmin = [admin_id, user_id];
    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, admin_id, callback);
            }
        ],
        function(error, result) {
            if (error) {
                var errorMsg = "Error occured";
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {
                adminModule.verifyAdmin(admin_id, function(result) {
                    if (result === false) {
                        var errorMsg = "Unauthorized access!"
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        adminModule.viewSpecificUserOrder(user_id, function(result) {
                            if (result === false) {
                                var errorMsg = "No list available tor this user";
                                sendResponse.sendErrorMessage(errorMsg, res);
                            } else {
                                sendResponse.sendSuccessData(result, res);
                            }
                        });
                    }
                });

            }
        });
});


/*
 *----------------------------------------------
 *API is used by admin to view all the offers done by all freelancer-user on particular order
 *INPUT: user_id, admin_id, list_id
 *OUTPUT: list all the order done by single user
 *----------------------------------------------
 */
router.get('/offersByUser', function(req, res, next) {
    var admin_id = req.query.admin_id;
    //var freelancer_id = req.query.user_id;
    var list_id = req.query.list_id;
    var arrAdmin = [admin_id, list_id];
    var arrUser = [list_id];
    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrAdmin, callback);
            }
        ],
        function(error, result) {
            if (error) {
                var errorMsg = "Error occured";
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {
                adminModule.verifyAdmin(admin_id, function(result) {
                    if (result === false) {
                        var errorMsg = "Unauthorized access!"
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        adminModule.offersByUser(arrUser, function(result) {
                            if (result === false) {
                                var errorMsg = "No list available tor this user";
                                sendResponse.sendErrorMessage(errorMsg, res);
                            } else {
                                sendResponse.sendSuccessData(result, res);
                            }
                        });
                    }
                });

            }
        });
});


/*
 *----------------------------------------------
 *API is used by admin to view all the accepted offers of freelancer-user by all clients
 *INPUT: user_id, admin_id
 *OUTPUT: list all the order done by single user
 *----------------------------------------------
 */
router.get('/acceptedOffersByUser', function(req, res, next) {
    var admin_id = req.query.admin_id;
    var freelancer_id = req.query.user_id;
    //  var list_id = req.query.list_id;
    var arrAdmin = [admin_id, freelancer_id];
    var arrUser = [freelancer_id];
    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrAdmin, callback);
            }
        ],
        function(error, result) {
            if (error) {
                var errorMsg = "Error occured";
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {
                adminModule.verifyAdmin(admin_id, function(result) {
                    if (result === false) {
                        var errorMsg = "Unauthorized access!"
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        adminModule.acceptedOffersByUser(arrUser, function(result) {
                            if (result === false) {
                                var errorMsg = "No list available tor this user";
                                sendResponse.sendErrorMessage(errorMsg, res);
                            } else {
                                sendResponse.sendSuccessData(result, res);
                            }
                        });
                    }
                });

            }
        });
});

/*
 *----------------------------------------------
 *API is used by admin to view all the paid offers of freelancer-user of all clients
 *INPUT: user_id, admin_id
 *OUTPUT: list all the order done by single user
 *----------------------------------------------
 */
router.get('/paidOffersByFreelancer', function(req, res, next) {
    var admin_id = req.query.admin_id;
    var freelancer_id = req.query.user_id;
    //  var list_id = req.query.list_id;
    var arrAdmin = [admin_id, freelancer_id];
    var arrUser = [freelancer_id];
    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrAdmin, callback);
            }
        ],
        function(error, result) {
            if (error) {
                var errorMsg = "Error occured";
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {
                adminModule.verifyAdmin(admin_id, function(result) {
                    if (result === false) {
                        var errorMsg = "Unauthorized access!"
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        adminModule.paidOffersByFreelancer(arrUser, function(result) {
                            if (result === false) {
                                var errorMsg = "No list available tor this user";
                                sendResponse.sendErrorMessage(errorMsg, res);
                            } else {
                                console.log(result);
                                sendResponse.sendSuccessData(result, res);
                            }
                        });
                    }
                });

            }
        });
});


/*
 *----------------------------------------------
 *API is used by admin to view all active order by admin
 *INPUT: admin_id
 *OUTPUT: list all the active order
 *----------------------------------------------
 */
router.get('/viewActiveOrder', function(req, res, next) {
    var admin_id = req.query.admin_id;
    //  var freelancer_id = req.query.user_id;
    //  var list_id = req.query.list_id;
    var arrAdmin = [admin_id];
    //var arrUser = [freelancer_id];
    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrAdmin, callback);
            }
        ],
        function(error, result) {
            if (error) {
                var errorMsg = "Error occured";
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {
                adminModule.verifyAdmin(admin_id, function(result) {
                    if (result === false) {
                        var errorMsg = "Unauthorized access!"
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        adminModule.viewActiveOrder(arrAdmin, function(result) {
                            if (result === false) {
                                var errorMsg = "No list available tor this user";
                                sendResponse.sendErrorMessage(errorMsg, res);
                            } else {
                                console.log(result);
                                sendResponse.sendSuccessData(result, res);
                            }
                        });
                    }
                });

            }
        });
});

/*
 *----------------------------------------------
 *API is used by admin to view all in-progress order by admin
 *INPUT: admin_id
 *OUTPUT: list all the active order
 *----------------------------------------------
 */
router.get('/viewInProgressOrder', function(req, res, next) {
    var admin_id = req.query.admin_id;
    //  var freelancer_id = req.query.user_id;
    //  var list_id = req.query.list_id;
    var arrAdmin = [admin_id];
    //var arrUser = [freelancer_id];
    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrAdmin, callback);
            }
        ],
        function(error, result) {
            if (error) {
                var errorMsg = "Error occured";
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {
                adminModule.verifyAdmin(admin_id, function(result) {
                    if (result === false) {
                        var errorMsg = "Unauthorized access!"
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        adminModule.viewInProgressOrder(arrAdmin, function(result) {
                            if (result === false) {
                                var errorMsg = "No list available tor this user";
                                sendResponse.sendErrorMessage(errorMsg, res);
                            } else {
                                console.log(result);
                                sendResponse.sendSuccessData(result, res);
                            }
                        });
                    }
                });

            }
        });
});

/*
 *----------------------------------------------
 *API is used by admin to view all finish order by admin
 *INPUT: admin_id
 *OUTPUT: list all the active order
 *----------------------------------------------
 */
router.get('/viewFinishOrder', function(req, res, next) {
    var admin_id = req.query.admin_id;
    //  var freelancer_id = req.query.user_id;
    //  var list_id = req.query.list_id;
    var arrAdmin = [admin_id];
    //var arrUser = [freelancer_id];
    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrAdmin, callback);
            }
        ],
        function(error, result) {
            if (error) {
                var errorMsg = "Error occured";
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {
                adminModule.verifyAdmin(admin_id, function(result) {
                    if (result === false) {
                        var errorMsg = "Unauthorized access!"
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        adminModule.viewFinishOrder(arrAdmin, function(result) {
                            if (result === false) {
                                var errorMsg = "No list available tor this user";
                                sendResponse.sendErrorMessage(errorMsg, res);
                            } else {
                                console.log(result);
                                sendResponse.sendSuccessData(result, res);
                            }
                        });
                    }
                });

            }
        });
});


/*
 *----------------------------------------------
 *API is used by admin to view all active order of particular user by admin
 *INPUT: admin_id, user_id
 *OUTPUT: list all the active order of particular user.
 *----------------------------------------------
 */
router.get('/viewActiveOrderByUser', function(req, res, next) {
    var admin_id = req.query.admin_id;
    var user_id = req.query.user_id;
    //  var list_id = req.query.list_id;
    var arrAdmin = [admin_id, user_id];
    var arrUser = [user_id];
    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrAdmin, callback);
            }
        ],
        function(error, result) {
            if (error) {
                var errorMsg = "Error occured";
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {
                adminModule.verifyAdmin(admin_id, function(result) {
                    if (result === false) {
                        var errorMsg = "Unauthorized access!"
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        adminModule.viewActiveOrderByUser(arrUser, function(result) {
                            if (result === false) {
                                var errorMsg = "No list available tor this user";
                                sendResponse.sendErrorMessage(errorMsg, res);
                            } else {
                                console.log(result);
                                sendResponse.sendSuccessData(result, res);
                            }
                        });
                    }
                });

            }
        });
});


/*
 *----------------------------------------------
 *API is used by admin to view all active order of particular user by admin
 *INPUT: admin_id, user_id
 *OUTPUT: list all the active order of particular user.
 *----------------------------------------------
 */
router.get('/viewFinishOrderByUser', function(req, res, next) {
    var admin_id = req.query.admin_id;
    var user_id = req.query.user_id;
    //  var list_id = req.query.list_id;
    var arrAdmin = [admin_id, user_id];
    var arrUser = [user_id];
    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrAdmin, callback);
            }
        ],
        function(error, result) {
            if (error) {
                var errorMsg = "Error occured";
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {
                adminModule.verifyAdmin(admin_id, function(result) {
                    if (result === false) {
                        var errorMsg = "Unauthorized access!"
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        adminModule.viewFinishOrderByUser(arrUser, function(result) {
                            if (result === false) {
                                var errorMsg = "No list available tor this user";
                                sendResponse.sendErrorMessage(errorMsg, res);
                            } else {
                                console.log(result);
                                sendResponse.sendSuccessData(result, res);
                            }
                        });
                    }
                });

            }
        });
});


/*
 *----------------------------------------------
 *API is used by admin to view all active order of particular user by admin
 *INPUT: admin_id, user_id
 *OUTPUT: list all the active order of particular user.
 *----------------------------------------------
 */
router.get('/viewInProgressOrderByUser', function(req, res, next) {
    var admin_id = req.query.admin_id;
    var user_id = req.query.user_id;
    //  var list_id = req.query.list_id;
    var arrAdmin = [admin_id, user_id];
    var arrUser = [user_id];
    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrAdmin, callback);
            }
        ],
        function(error, result) {
            if (error) {
                var errorMsg = "Error occured";
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {
                adminModule.verifyAdmin(admin_id, function(result) {
                    if (result === false) {
                        var errorMsg = "Unauthorized access!"
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        adminModule.viewInProgressOrderByUser(arrUser, function(result) {
                            if (result === false) {
                                var errorMsg = "No list available tor this user";
                                sendResponse.sendErrorMessage(errorMsg, res);
                            } else {
                                console.log(result);
                                sendResponse.sendSuccessData(result, res);
                            }
                        });
                    }
                });

            }
        });
});

/*
 *----------------------------------------------
 *API is used by admin to view all the paid offers of freelancer-user of all clients
 *INPUT: user_id, admin_id
 *OUTPUT: list all the order done by single user
 *----------------------------------------------
 */
router.get('/paidOffersByUser', function(req, res, next) {
    var admin_id = req.query.admin_id;
    var client_id = req.query.client_id;
    //  var list_id = req.query.list_id;
    var arrAdmin = [admin_id, client_id];
    var arrUser = [client_id];
    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrAdmin, callback);
            }
        ],
        function(error, result) {
            if (error) {
                var errorMsg = "Error occured";
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {
                adminModule.verifyAdmin(admin_id, function(result) {
                    if (result === false) {
                        var errorMsg = "Unauthorized access!"
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        adminModule.paidOffersByUser(arrUser, function(result) {
                            if (result === false) {
                                var errorMsg = "No list available tor this user";
                                sendResponse.sendErrorMessage(errorMsg, res);
                            } else {
                                console.log(result);
                                sendResponse.sendSuccessData(result, res);
                            }
                        });
                    }
                });

            }
        });
});

/*
 *----------------------------------------------
 *API is used by admin to delete user and its all records including order and offers done by it.
 *INPUT: adminName and Password
 *OUTPUT: delete user records and account
 *----------------------------------------------
 */

router.get('/deleteUser', function(req, res, next) {
    var admin_id = req.query.admin_id;
    var user_id = req.query.user_id;
    arrFields = [admin_id, user_id];
    console.log(arrFields);

    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrFields, callback);
            }
        ],
        function(error, result) {
            if (error) {
                console.error(error);
                var errorMsg = 'Empty fields....'
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {
                adminModule.verifyAdmin(admin_id, function(result) {
                    if (result === false) {
                        var errorMsg = "Access Denied";
                        console.error(errorMsg);
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        adminModule.deleteUser(user_id, function(result) {
                            if (result === false) {
                                var errorMsg = "Error occured..."
                                console.error(errorMsg);
                                sendResponse.sendErrorMessage(errorMsg, res);
                            } else {

                                var successMsg = "User and its related records deleted successfuly."
                                sendResponse.successStatusMsg(successMsg, res);
                            }
                        });
                    }
                });
            }
        });
});


/*
 *----------------------------------------------
 *API for admin FAQ
 *INPUT: admin_id, question, answer
 *OUTPUT: Success message
 *----------------------------------------------
 */

router.post('/faq', function(req, res, next) {
    var admin_id = req.body.admin_id;
    var question = req.body.question;
    var answer = req.body.answer;
    var arrFields = [admin_id, question, answer];
    console.log('is working');
    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrFields, callback);
          }],
        function(error, result) {
          if (error) {
            var errorMsg = "Error Occour!!";
            sendResponse.sendErrorMessage(errorMsg, res);
          } else {
            adminModule.verifyAdmin(admin_id, function(result){
              if (result===false) {
                var errorMsg = "It seems you are not authorized user. Please login with admin credintials.";
                sendResponse.sendErrorMessage(errorMsg, res);
              } else {
                arrFields = [question, answer];
                adminModule.faq(arrFields, function(result){
                  if (error) {
                  var errorMsg = "Posting FAQ failed.";
                  sendResponse.sendErrorMessage(errorMsg, res);
                  } else {
                    var successMsg = "FAQ postd successfully."
                    sendResponse.successStatusMsg(successMsg, res);
                  }
                });

              }
            });
          }
        });
});


router.get('/deleteFaq', function(req, res, next){
  var id = req.query.id;
  adminModule.deleteFaq(id, function(result){
    if (result===false) {
      var errorMsg = "Unable to delete....";
      sendResponse.sendErrorMessage(errorMsg, res);
    } else {
      var successMsg = "Faq deleted successfully.";
      sendResponse.successStatusMsg(successMsg, res);
    }
  });
});

/*
 *----------------------------------------------
 *API for to view faq
 *OUTPUT: display all faq
 *----------------------------------------------
 */

router.get('/getFaq', function(req, res, next) {
    console.log('is working');
    adminModule.getFaq(function(result){
      if (result===false) {
        console.error(error);
        var errorMsg = "Error occour";
        sendResponse.sendErrorMessage(errorMsg, res);
      } else {
        sendResponse.sendSuccessData(result, res);
      }
    });
});

module.exports = router;
