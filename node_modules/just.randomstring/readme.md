#just.randomstring#

[![Build Status](https://travis-ci.org/kopipejst/just.randomstring.png)](https://travis-ci.org/kopipejst/just.randomstring)


JavaScript random string generator.

Can be used for generating random string for api keys, passwords ...

##Installation##

###Node.js###

**npm package**

    npm install just.randomstring


**use in node.js**

    var randomstring = require('just.randomstring');

###Browser###

- download just.randomstring.js from [GitHub](https://github.com/kopipejst/just.randomstring)
- include on your page: `<script src="just.randomstring.js"></script>`


##Usage##

randomstring can be used in node.js or on client side in browser

###node.js

    var randomstring = randomstring();

###browser

    var randomstring = just.randomstring();
    
##Options##

###len
length of random string (default 20)

examples:

    var rs = randomstring(); // returns "ElZOtlOSLn49GeKLev2O"
    var rs = randomstring(5); // returns "Erf7g"


###type
type of characters that will be used for string generating (default numbers_uppercases_lowercases)

type can be **numbers**, **uppercases**, **lowercases** or combination of those separated with **_**

examples:

    var rs = randomstring(20, 'numbers'); // returns "78394850802905961074"
    var rs = randomstring(15, 'numbers_uppercases'); // returns "PXL3AE2USI7ZDQ2"

##Array of random strings##

`randomstring.array()` will return array of 5 random strings by default

accepts 3 params, where first one is length of array, while second and third are the same as for randomstring()

examples:

    var rs = randomstring.array(20); // returns array of 20 random strings
    var rs = randomstring.array(5, 30, 'numbers'); // returns array of 5 random strings with 30 character length types of numbers

##Demo##
[workshop.rs](http://workshop.rs/projects/just-randomstring)

