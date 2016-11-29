/*
 *-------------------------------------------------------
 * These functions are used for common operations
 *-------------------------------------------------------
*/
var sendResponse = require('./sendResponse');

/*
 *--------------------------------------------------------
 * This function is used to check blanks for mendatory feilds.
 * INPUT: The array of mendatory feilds to check either the feilds are mendatory or not.
 * OUTPUT: Error if mendatory feilds are not filled.
*/

exports.checkFeilds = function(res, arrFeilds, callback){
  var checkBlankData = checkFeilds(arrFeilds);
  if(checkBlankData){
    sendResponse.someParamaterMissingError(res);
  }else{
    callback(null);
  }
}

function checkFeilds(arr){
  var len = arr.length;
  for(var i = 0; i<len; i++){
    if(arr[i]===' '){
      return 1;
    }else if(arr[i]===undefined){
      console.log(arr[i]+'undefined');
      return 1;
    }else if(arr[i]==='(null)'){
      return 1;
    }
  }
  return 0;
}

exports.encrypt = function (text) {

    var crypto = require('crypto');
    var cipher = crypto.createCipher('aes-256-cbc', 'd6F3Efeq');
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

exports.userAthenticationTokenError = function(){

}
