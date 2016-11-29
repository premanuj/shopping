var constant = require('./constant');
exports.someThingWrongError = function(res){
  var errResponse = {
    status: constant.responseStatus.ERROR_IN_EXECUTION,
    message: constant.responseMessage.ERROR_IN_EXECUTION,
    data: {}
  }
  sendData(errResponse, res);
}

exports.sendSuccessData = function(data, res){
  var successResponse = {
    status: constant.responseStatus.SHOW_DATA,
    message: constant.responseMessage.SHOW_DATA,
    data: data
  }
  sendData(successResponse, res);
}

exports.invalidAccessToken = function(res){
  var errResponse = {
    status: constant.responseStatus.INVALID_ACCESS_TOKEN,
    message: constant.responseMessage.INVALID_ACCESS_TOKEN,
    data: {}
    }
    sendData(errResponse, res);
}

exports.someParamaterMissingError = function(res){
  var errResponse = {
    status: constant.responseStatus.MISSING_PARAMETER,
    message: constant.responseMessage.MISSING_PARAMETER,
    data: {}
  }
  sendData(errResponse, res);
}

exports.sendErrorMessage = function(msg, res){
  var errResponse = {
    status: constant.responseStatus.SHOW_ERROR_MESSAGE,
    message: msg,
    data: {}
  }
  sendData(errResponse, res);
}

exports.successStatusMsg = function(msg, res){
  var successResponse = {
    status: constant.responseStatus.SHOW_DATA,
    message: msg,
    data: {}
  }
  sendData(successResponse, msg);
}

exports.sendData = function(data, res){
  sendData(data, res);
}

function sendData(data, res){
  res.type('json');
  res.jsonp(data);
}
