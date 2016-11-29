var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var fs = require('fs');

//var connection = require('./routes/modules/dbConnection');
var nodemailer = require('nodemailer');
    mailer = require('./routes/nodemailer');
    transporter = nodemailer.createTransport(mailer);

var index = require('./routes/index');
var users = require('./routes/users');

var adminController = require('./controllers/adminController');
var userController = require('./controllers/userController');
//  var userController = require('./routes/controllers/userController');
  //var orderController = require('./routes/controllers/orderController');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/admin', adminController);
app.use('/user', userController);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(3030);
console.log('You are listening to prot 3030');
module.exports = app;
