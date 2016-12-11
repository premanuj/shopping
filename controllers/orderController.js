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

router.post('/neworder', function(req, res, next) {
    var user_id = req.body.user_id;
    var list_name = req.body.list_name;
    var items = req.body.items;
    var store = req.body.store;
    var notes = req.body.notes;
    var delivery_address = req.body.delivery_address;
    var delivery_time_from = req.body.delivery_time_from;
    var delivery_time_to = req.body.delivery_time_to;
    var payment_type = req.body.payment_type;
    var estimated_weight = req.body.estimated_weight;

    var arrFields = [list_name, items, store, notes, delivery_address, delivery_time_from, delivery_time_to, payment_type, estimated_weight, user_id]
    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrFields, callback);
            }
        ],
        function(error, result) {
            if (error) {
                var errorMsg = "Unable to do a new order for this user.";
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {
                orderModule.neworder(arrFields, function(result) {
                    if (result === false) {
                        var errorMsg = "Error Occured!";
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        var successMsg = 'Items Added Successfully!';
                        sendResponse.successStatusMsg(successMsg, res);
                    }
                });
            }
        });
});



/*
 *---------------------------------------------------------------------------------------------------
 *This API is used to change the order status by the user
 *INPUTS: user_id, list_id
 *OUTPUT: change status of order by the user who wants to hire freelancer
 *----------------------------------------------------------------------------------------------------
 */

router.post('/changeOrderStatus', function(req, res, next) {
    var list_id = req.body.list_id;
    var user_id = req.body.user_id;
    var status = req.body.status;

    var arrFields = [status, list_id, user_id];
    console.log(arrFields);
    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrFields, callback);
            }
        ],
        function(error, result) {
            if (error) {
                var errorMsg = "Unable to change the order status";
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {
                orderModule.changeOrderStatus(arrFields, function(getResult) {
                    if (getResult == false) {
                        var errorMsg = "Error Encoured!";
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        var successMsg = "Status change to " + status + "successfully!";
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
 *OUTPUT: rate an order
 *----------------------------------------------------------------------------------------------------
 */

router.post('/rateOrder', function(req, res, next) {
    var list_id = req.body.list_id;
    var user_id = req.body.user_id;
    var rate = req.body.rate;

    var arrToCheckStatus = [list_id, user_id];
    var arrToRate = [rate, list_id, user_id];

    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrToRate, callback);
            }
        ],
        function(error, result) {
            if (error) {
                console.log(error);
                var errorMsg = "Error Occoured!";
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {
                orderModule.checkOrderStatus(arrToCheckStatus, function(result) {
                    if (result === false) {
                        var errorMsg = "Only the status with 'Finished' can rated the order";
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        if (result === 'finish') {
                            orderModule.rateOrder(arrToRate, function(result) {
                                if (result === false) {
                                    var errorMsg = "Order cannot be rated! ";
                                    sendResponse.sendErrorMessage(errorMsg, res);
                                } else {
                                    var successMsg = "Order rated to " + rate + " successfully!"
                                    sendResponse.successStatusMsg(successMsg, res);
                                }
                            });
                        } else {
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

router.post('/deleteOrder', function(req, res, next) {
    var user_id = req.body.user_id;
    var list_id = req.body.list_id;
    //  var status = req.bosy.status;

    var arrFields = [list_id, user_id];
    var delOrder = [list_id];

    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrFields, callback);
            }
        ],
        function(error, result) {
            if (error) {
                var errorMsg = "Error Occured!!!";
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {
                orderModule.checkOrderStatus(arrFields, function(result) {
                    if (result === false) {
                        var errorMsg = "orderstatus: Order cannot be deleted!!!";
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        if (result === 'active' || result === 'deactive') {
                            orderModule.deleteOrder(delOrder, function(result) {
                                if (result === false) {
                                    var errorMsg = "deleteStatus: Order Cannot be Deleted!!!"
                                    sendResponse.sendErrorMessage(errorMsg, res);
                                } else {
                                    var successMsg = "Order Deleteted Successfully!!!";
                                    sendResponse.successStatusMsg(successMsg, res);
                                }
                            });
                        } else {
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
 *This API is used to view active order of particular user
 *INPUTS: user_id
 *OUTPUT: list of active orders
 *----------------------------------------------------------------------------------------------------
 */


router.get('/activeOrderUser', function(req, res, next) {
    var user_id = req.query.user_id;
    var arrOrder = [user_id];

    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrOrder, callback);
            }
        ],
        function(error, result) {
            if (error) {
                var errorMsg = "Error occured!!!";
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {
                orderModule.activeOrderUser(arrOrder, function(result) {
                    if (result === false) {
                        var errorMsg = 'No active order for this user';
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        sendResponse.sendSuccessData(result, res);
                    }
                });
            }
        });
});


/*
 *---------------------------------------------------------------------------------------------------
 *This API is used to view finish order of particular user
 *INPUTS: user_id
 *OUTPUT: list of finish orders
 *----------------------------------------------------------------------------------------------------
 */

router.get('/finishOrderUser', function(req, res, next) {
    var user_id = req.query.user_id;
    var arrOrder = [user_id];

    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrOrder, callback);
            }
        ],
        function(error, result) {
            if (error) {
                var errorMsg = "Error occured!!!";
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {
                orderModule.finishOrderUser(arrOrder, function(result) {
                    if (result === false) {
                        var errorMsg = 'No finish offer for this user';
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        sendResponse.sendSuccessData(result, res);
                    }
                });
            }
        });
});


/*
 *---------------------------------------------------------------------------------------------------
 *This API is used to view in-progress order of particular user
 *INPUTS: user_id
 *OUTPUT: list of finish orders
 *----------------------------------------------------------------------------------------------------
 */

router.get('/in-progressOrderUser', function(req, res, next) {
    var user_id = req.query.user_id;
    var arrOrder = [user_id];

    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrOrder, callback);
            }
        ],
        function(error, result) {
            if (error) {
                var errorMsg = "Error occured!!!";
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {
                orderModule.inprogressOrderUser(arrOrder, function(result) {
                    if (result === false) {
                        var errorMsg = 'No finish offer for this user';
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        sendResponse.sendSuccessData(result, res);
                    }
                });
            }
        });
});


/*
 *---------------------------------------------------------------------------------------------------
 *This API is used to deactivate an order status
 *INPUTS: user_id, list_id, status
 *OUTPUT: change active status to
 *----------------------------------------------------------------------------------------------------
 */


router.post('/orderOffer', function(req, res, next) {
    var list_id = req.body.list_id;
    var freelancer_id = req.body.freelancer_id;
    var client_id = req.body.client_id;
    //  var data = new date();
    var arrOrder = [list_id, client_id, freelancer_id];

    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrOrder, callback);
            }
        ],
        function(error, result) {
            if (error) {
                var errorMsg = "Error occured!!!";
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {
                orderModule.orderOffer(arrOrder, function(result) {
                    if (result === false) {
                        var errorMsg = 'Unable to offer an order';
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        var successMsg = 'Order offered successfully!';
                        sendResponse.successStatusMsg(successMsg, res);
                    }
                });
            }
        });
});


/*
 *---------------------------------------------------------------------------------------------------
 *This API is used to accept an offer by client who wants to hire
 *INPUTS: offer_id, list_id, user_id
 *OUTPUT: change offer status status to accepted.
 *----------------------------------------------------------------------------------------------------
 */


router.post('/acceptOffer', function(req, res, next) {
    var offer_id = req.body.offer_id;
    var list_id = req.body.list_id;
    var user_id = req.body.user_id;
    var arrOrder = [offer_id, list_id, user_id];
    var updateOfferStatus = ["accepted", offer_id, user_id];
    var updateOrderStatus = ['in_progress', list_id, user_id];

    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrOrder, callback);
            }
        ],
        function(error, result) {
            if (error) {
                var errorMsg = "Error occured!!!";
                sendResponse.sendErrorMessage(errorMsg, res);
            } else {

                orderModule.checkOfferAcceptedStatus(list_id, function(result) {
                    if (result === 0) {
                        var errorMsg = 'No list item exist!!';
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else if (result === false) {
                        var errorMsg = 'You cannot accept this offer. This offer had been already accepted';
                        sendResponse.sendErrorMessage(errorMsg, res);
                    } else {
                        orderModule.acceptOffer(updateOfferStatus, function(result) {
                            if (result === false) {
                                var errorMsg = 'Unable to accept an offer of an order';
                                sendResponse.sendErrorMessage(errorMsg, res);
                            } else {
                                orderModule.progerssOrder(updateOrderStatus, function(result) {
                                    if (result === false) {
                                        var errorMsg = 'Unable to update status of order. Offer status is changeed to expire.';
                                        sendResponse.sendErrorMessage(errorMsg, res);
                                    } else {
                                        var successMsg = 'Order and offer status updated to expire and in-progress respectively successfully!';
                                        sendResponse.successStatusMsg(successMsg, res)
                                    }

                                });
                            }
                        });
                    }
                });

            }
        });
});

/*
 *---------------------------------------------------------------------------------------------------
 *This API is used to mark an order status finish
 *INPUTS: list_id, user_id
 *OUTPUT: change order status to finish.
 *----------------------------------------------------------------------------------------------------
 */

router.post('/finishOrder', function(req, res, next) {
    var list_id = req.body.list_id;
    var user_id = req.body.user_id;
    var status = 'finish';

    var arrOrder = [status, list_id, user_id];

    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrOrder, callback);
            }
        ],
        function(error, result) {
                if (error) {
                    var errorMsg = "Unable to do a new order for this user.";
                    sendResponse.sendErrorMessage(errorMsg, res);
                } else {
                    orderModule.finishOrder(arrOrder, function(result) {
                        if (result === false) {
                            var errorMsg = "Error Occured!!!";
                            sendResponse.sendErrorMessage(errorMsg, res);
                        } else {
                            var successMsg = 'Order status has been marked as finished. Now users can review on the order by both who hires and who hires';
                            sendResponse.successStatusMsg(successMsg, res);
                        }
                    });
                }
        });
});

/*
 *---------------------------------------------------------------------------------------------------
 *This API is used to post review by client who hires freelancer
 *INPUTS: list_id, client_id, freelancer_id, review_by_client,
 *OUTPUT: post review by client for freelancer work.
 *----------------------------------------------------------------------------------------------------
 */

router.post('/clientReview', function(req, res, next) {
    var list_id = req.body.list_id;
    var client_id = req.body.client_id;
    var freelancer_id = req.body.freelancer_id;
    var review_by_client = req.body.review_by_client;
    var status = 'finish';

    var arrOrder = [list_id, status];
    var arrReview = [review_by_client, client_id, freelancer_id, list_id];

    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrReview, callback);
            }
        ],
        function(error, result) {
                if (error) {
                    var errorMsg = "Unable to do a new order for this user.";
                    sendResponse.sendErrorMessage(errorMsg, res);
                } else {
                    orderModule.checkForFinishOrder(arrOrder, function(result) {
                        if (result === false) {
                            var errorMsg = "Only order with finished order can be Reviewed";
                            sendResponse.sendErrorMessage(errorMsg, res);
                        } else {
                            orderModule.clientReview(arrReview, function(result) {
                                if (result === false) {
                                    var errorMsg = "Error Occured"
                                    sendResponse.sendErrorMessage(errorMsg, res);
                                } else {
                                    var successMsg = 'Order reviewed successfully by the client for the freelancer to whom he hired.';
                                    sendResponse.successStatusMsg(successMsg, res);
                                }
                            });
                        }
                    });
                }

        });
});



/*
 *---------------------------------------------------------------------------------------------------
 *This API is used to accept an offer by freelancer who wants to be hired.
 *INPUTS: list_id, client_id, freelancer_id, review_by_client
 *OUTPUT: post review by freelancer for whom he works
 *----------------------------------------------------------------------------------------------------
 */

router.post('/freelancerReview', function(req, res, next) {
    var list_id = req.body.list_id;
    var client_id = req.body.client_id;
    var freelancer_id = req.body.freelancer_id;
    var review_by_client = req.body.review_by_client;
    var status = 'finish';

    var arrOrder = [list_id, status];
    var arrReview = [review_by_client, client_id, list_id];

    async.waterfall([
            function(callback) {
                useFunction.checkFeilds(res, arrReview, callback);
            }
        ],
        function(error, result) {
                if (error) {
                    var errorMsg = "Unable to do a new order for this user.";
                    sendResponse.sendErrorMessage(errorMsg, res);
                } else {
                    orderModule.checkForFinishOrder(arrOrder, function(result) {
                        if (result === false) {
                            var errorMsg = "Only order with finished order can be Reviewed";
                            sendResponse.sendErrorMessage(errorMsg, res);
                        } else {
                            if (checkFreelancer(list_id, freelancer_id) === false) {
                                var errorMsg = "You are not allowed to post review.";
                                sendresponse.sendErrorMessage(errorMsg, res);
                            } else {
                                orderModule.freelancerReview(arrReview, function(result) {
                                    if (result === false) {
                                        var errorMsg = "Only order with finished order can be Reviewed"
                                        sendResponse.sendErrorMessage(errorMsg, res);
                                    } else {
                                        var successMsg = 'Order reviewed successfully by the client for the freelancer to whom he hired.';
                                        sendResponse.successStatusMsg(successMsg, res);
                                    }
                                });
                            }
                        }
                    });
                }
        });
});

function checkFreelancer(list_id, freelancer_id) {
    var arrFreelancer = [list_id, freelancer_id];
    orderModule.checkFreelancer(arrFreelancer, function(result) {
        if (result === true) {
            return true;
        } else {
            return false;
        }
    });
}

module.exports = router;
