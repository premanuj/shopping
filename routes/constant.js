/*
*
*This is developed by....
*
*/

function define(obj, name, value){
  Object.defineProperty(obj, name, {
    value: value,
    enumerable: true,
    writable: false,
    configurable: false
  })
}

exports.responseStatus = {};

define(exports.responseStatus, 'MISSING_PARAMETER', 100);
define(exports.responseStatus, 'INVALID_ACCESS_TOKEN', 101);
define(exports.responseStatus, 'ERROR_IN_EXECUTION', 102);
define(exports.responseStatus, 'SHOW_ERROR_MESSAGE', 103);
define(exports.responseStatus, 'SHOW_MESSAGE', 104);
define(exports.responseStatus, 'SHOW_DATA', 105);

exports.responseMessage = {};

define(exports.responseMessage, 'MISSING_PARAMETER', 'Some Parameter is missing!!!');
define(exports.responseMessage, 'INVILID_ACCESS_TOKEN', 'Username or Password provided is not authentic.');
define(exports.responseMessage, 'ERROR_IN_EXECUTION', 'Some error occured, please try again.');
define(exports.responseMessage, 'SHOW_ERROR_MESSAGE', 'Some error occured, please try again.');
define(exports.responseMessage, 'SHOW_MESSAGE', 'This is for success message.');
define(exports.responseMessage, 'SHOW_DATA', '');
