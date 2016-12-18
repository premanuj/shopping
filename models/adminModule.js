var connection = require('./dbConnection');


module.exports.approveUser = function(arrUser, callback) {
    var user_id = arrUser[1];
    var statusRequest = 'request';
    var statusAccept = 'approved'
    var arrUpdate = [statusAccept, user_id, statusRequest];
    var sql_acceptUser = "UPDATE user SET status = ? WHERE user_id = ?";

    connection.query(sql_acceptUser, arrUpdate, function(error, result) {
        if (error) {
            console.error(error);
            callback(false);
        } else {
            callback(true);
        }
    });
};


module.exports.verifyAdmin = function(admin_id, callback) {
    var admin_id = [admin_id];
    var sql_verifyAdmin = "SELECT admin_id FROM admin WHERE admin_id = ?";

    connection.query(sql_verifyAdmin, admin_id, function(error, resultRows, fields) {
        if (error) {
            console.error(error);
            callback(false);
        } else {
            if (resultRows === 0) {
                callback(false);
            } else {
                callback(true);
            }
        }
    });
};


module.exports.faq = function(arrFaq, callback) {
    var sql_addFaq = "INSERT INTO faq (question, answer) VALUES (?, ?)";
    connection.query(sql_addFaq, arrFaq, function(error, resultRows) {
        if (error) {
            console.error(error);
            callback(false);
        } else {
            callback(true);
        }
    });
};

module.exports.getFaq = function(callback) {
    var sql_getFaq = "SELECT question, answer FROm faq";
    connection.query(sql_getFaq, function(error, resultRows, fields) {
        if (error) {
            console.error(error);
            callback(false);
        } else {
            callback(resultRows);
        }
    });
};

module.exports.viewUsers = function(admin_id, callback) {
    var sql_viewUsers = "SELECT user_id, username, email, status FROM user";

    connection.query(sql_viewUsers, function(error, resultRows, fields) {
        if (error) {
            console.error(error);
            callback(false);
        } else {
            if (resultRows === 0) {
                console.log('no list');
                callback(false);
            } else {
                callback(resultRows);
            }
        }
    });
};


module.exports.viewSpecificUserOrder = function(user_id, callback) {
    var sql_viewUsers = "SELECT list_id, list_name, items, store, notes FROM shopping_list WHERE user_id = ?";

    connection.query(sql_viewUsers, user_id, function(error, resultRows, fields) {
        if (error) {
            console.error(error);
            callback(false);
        } else {
            if (resultRows === 0) {
                console.log('no list');
                callback(false);
            } else {
                callback(resultRows);
            }
        }
    });
};


module.exports.offersByUser = function(arrUser, callback) {

    var sql_listUser = "SELECT u.user_id, u.email, u.username, sl.list_name, sl.items  FROM user u INNER JOIN offer_list ol ON u.user_id = ol.freelancer_id INNER JOIN shopping_list sl ON sl.list_id = ol.list_id WHERE ol.list_id = ? AND freelancer_id IS NOT NULL"

    connection.query(sql_listUser, arrUser, function(error, resultRows, fields) {
        if (error) {
            console.error(error);
            callback(false);
        } else {
            if (resultRows === 0) {
                console.log('no list');
                callback(false);
            } else {
                console.log(resultRows);
                callback(resultRows);
            }
        }
    });
};


module.exports.acceptedOffersByUser = function(arrUser, callback) {

    var sql_listUser = "SELECT sl.list_name, sl.items, ol.client_id, ol.freelancer_id FROM shopping_list sl INNER JOIN offer_list ol ON sl.list_id = ol.list_id WHERE ol.freelancer_id = ? AND ol.status = 'accepted'"

    connection.query(sql_listUser, arrUser, function(error, resultRows, fields) {
        if (error) {
            console.error(error);
            callback(false);
        } else {
            if (resultRows === 0) {
                console.log('no list');
                callback(false);
            } else {
                //  console.log(resultRows);
                callback(resultRows);
            }
        }
    });
};

module.exports.paidOffersByFreelancer = function(arrUser, callback) {

    var sql_listUser = "SELECT sl.list_name, sl.items, ol.client_id, ol.freelancer_id, ol.status FROM shopping_list sl INNER JOIN offer_list ol ON sl.list_id = ol.list_id WHERE ol.freelancer_id = ? AND ol.freelancer_id IS NOT NULL AND ol.status = 'paid'";

    connection.query(sql_listUser, arrUser, function(error, resultRows, fields) {
        if (error) {
            console.error(error);
            callback(false);
        } else {
            if (resultRows === 0) {
                console.log('no list');
                callback(false);
            } else {
                //  console.log(resultRows);
                callback(resultRows);
            }
        }
    });
};

module.exports.paidOffersByUser = function(arrUser, callback) {

    var sql_listUser = "SELECT sl.list_name, sl.items, ol.client_id, ol.freelancer_id, ol.sthodneatus FROM shopping_list sl INNER JOIN offer_list ol ON sl.list_id = ol.list_id WHERE ol.client_id = ? AND ol.status = 'paid'";

    connection.query(sql_listUser, arrUser, function(error, resultRows, fields) {
        if (error) {
            console.error(error);
            callback(false);
        } else {
            if (resultRows === 0) {
                console.log('no list');
                callback(false);
            } else {
                //  console.log(resultRows);
                callback(resultRows);
            }
        }
    });
};


module.exports.viewActiveOrder = function(arrUser, callback) {

    //var sql_listUser = "SELECT DISTINCT sl.list_name, sl.items, ol.client_id, ol.freelancer_id, ol.status FROM shopping_list sl INNER JOIN offer_list ol ON sl.list_id = ol.list_id WHERE ol.clier_id = ? AND ol.status = 'paid'";
    var sql_listActiveOrder = "SELECT user_id, list_id, list_name, items, rating, status, payment_type, delivery_address FROM shopping_list WHERE status = 'active'";
    connection.query(sql_listActiveOrder, function(error, resultRows, fields) {
        if (error) {
            console.error(error);
            callback(false);
        } else {
            if (resultRows === 0) {
                console.log('no list');
                callback(false);
            } else {
                //  console.log(resultRows);
                callback(resultRows);
            }
        }
    });
};


module.exports.viewInProgressOrder = function(arrUser, callback) {

    //var sql_listUser = "SELECT DISTINCT sl.list_name, sl.items, ol.client_id, ol.freelancer_id, ol.status FROM shopping_list sl INNER JOIN offer_list ol ON sl.list_id = ol.list_id WHERE ol.clier_id = ? AND ol.status = 'paid'";
    var sql_listInProgressOrder = "SELECT user_id, list_id, list_name, items, rating, status, payment_type, delivery_address FROM shopping_list WHERE status = 'in_progress'";
    connection.query(sql_listInProgressOrder, function(error, resultRows, fields) {
        if (error) {
            console.error(error);
            callback(false);
        } else {
            if (resultRows === 0) {
                console.log('no list');
                callback(false);
            } else {
                //  console.log(resultRows);
                callback(resultRows);
            }
        }
    });
};

module.exports.viewFinishOrder = function(arrUser, callback) {

    //var sql_listUser = "SELECT DISTINCT sl.list_name, sl.items, ol.client_id, ol.freelancer_id, ol.status FROM shopping_list sl INNER JOIN offer_list ol ON sl.list_id = ol.list_id WHERE ol.clier_id = ? AND ol.status = 'paid'";
    var sql_listFinishOrder = "SELECT user_id, list_id, list_name, items, rating, status, payment_type, delivery_address FROM shopping_list WHERE status = 'finish'";
    connection.query(sql_listFinishOrder, function(error, resultRows, fields) {
        if (error) {
            console.error(error);
            callback(false);
        } else {
            if (resultRows === 0) {
                console.log('no list');
                callback(false);
            } else {
                //  console.log(resultRows);
                callback(resultRows);
            }
        }
    });
};


module.exports.viewActiveOrderByUser = function(arrUser, callback) {

    //var sql_listUser = "SELECT DISTINCT sl.list_name, sl.items, ol.client_id, ol.freelancer_id, ol.status FROM shopping_list sl INNER JOIN offer_list ol ON sl.list_id = ol.list_id WHERE ol.clier_id = ? AND ol.status = 'paid'";
    var sql_listActiveOrder = "SELECT user_id, list_id, list_name, items, rating, status, payment_type, delivery_address FROM shopping_list WHERE status = 'active' AND user_id = ?";
    connection.query(sql_listActiveOrder, arrUser, function(error, resultRows, fields) {
        if (error) {
            console.error(error);
            callback(false);
        } else {
            if (resultRows === 0) {
                console.log('no list');
                callback(false);
            } else {
                //  console.log(resultRows);
                callback(resultRows);
            }
        }
    });
};

module.exports.viewFinishOrderByUser = function(arrUser, callback) {

    //var sql_listUser = "SELECT DISTINCT sl.list_name, sl.items, ol.client_id, ol.freelancer_id, ol.status FROM shopping_list sl INNER JOIN offer_list ol ON sl.list_id = ol.list_id WHERE ol.clier_id = ? AND ol.status = 'paid'";
    var sql_listFinishOrder = "SELECT user_id, list_id, list_name, items, rating, status, payment_type, delivery_address FROM shopping_list WHERE status = 'finish' AND user_id = ?";
    connection.query(sql_listFinishOrder, arrUser, function(error, resultRows, fields) {
        if (error) {
            console.error(error);
            callback(false);
        } else {
            if (resultRows === 0) {
                console.log('no list');
                callback(false);
            } else {
                //  console.log(resultRows);
                callback(resultRows);
            }
        }
    });
};


module.exports.viewInProgressOrderByUser = function(arrUser, callback) {

    //var sql_listUser = "SELECT DISTINCT sl.list_name, sl.items, ol.client_id, ol.freelancer_id, ol.status FROM shopping_list sl INNER JOIN offer_list ol ON sl.list_id = ol.list_id WHERE ol.clier_id = ? AND ol.status = 'paid'";
    var sql_listInProgressOrder = "SELECT user_id, list_id, list_name, items, rating, status, payment_type, delivery_address FROM shopping_list WHERE status = 'in_progress' AND user_id = ?";
    connection.query(sql_listInProgressOrder, arrUser, function(error, resultRows, fields) {
        if (error) {
            console.error(error);
            callback(false);
        } else {
            if (resultRows === 0) {
                console.log('no list');
                callback(false);
            } else {
                //  console.log(resultRows);
                callback(resultRows);
            }
        }
    });
};


module.exports.deleteUser = function(user_id, callback) {
    var delUser = [user_id, user_id];
    //var sql_deleteUser = "Delete t1, sl, ol FROM user as t1  INNER JOIN  shopping_list as sl on t1.user_id = sl.user_id INNER JOIN  offer_list as ol on t1.user_id=ol.client_id OR t1.user_id= ol.freelancer_id WHERE  t1.user_id=?";
    var sql_deleteUser = "Delete FROM user WHERE user_id=?";
    var sql_deleteShopping = "Delete FROM shopping_list WHERE user_id=?";
    var sql_deleteOffer = "DELETE FROM offer_list WHERE client_id=? OR freelancer_id = ? AND status NOT IN ('open')";
    var sql_updateOffer = "UPDATE offer_list SET freelancer_id = ? WHERE ";
    //  var sql_deleteUser = "Delete FROM user WHERE user_id=?";
    connection.query(sql_deleteUser, user_id, function(error, result) {
        if (error) {
            console.error(error);
            callback(false);
        } else {
            connection.query(sql_deleteShopping, user_id, function(error, result) {
                if (error) {
                    callback(false);
                } else {
                    connection.query(sql_deleteOffer, delUser, function(error, result) {
                        if (error) {
                            callback(false);
                        } else {
                            console.log(result);
                            callback(true);
                        }
                    });
                }
            });
        }
    });
};
