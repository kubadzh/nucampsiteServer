var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session');
const FileStore = require('session-file-store')(session); // require f is returning another f as its return value, then we immediately calling that return f with this 2nd param list of 'session.. 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/nucampsite'; // url for mongodb server
const connect = mongoose.connect(url, { // we setup a connection
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'), // handling promise
    err => console.log(err)
);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//  app.use(cookieParser('12345-67890-09876-54321')); // there might me an issue if we use cookie=parser and express-session together


// *** Here we use session middleware 'app.use', options below are commonly set
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false, // when new session is created, but then no updates are made to it, then at the end of the request it won't get saved, because it will just be an empty session without any usefull information and also no cookie will be sent to the client, that helps to prevent to have bunch of empty files and cookies being setup
  resave: false, // once the seesion has bee created it will continue to be re-saved whenever request has been made to that session, even if that req didnt make any updates that needed to be saved
  store: new FileStore() // this will create a new FileStore as an object that we use to save our session infomration to the servers hard disk, instead of just running the apps memmory 
}));


// Basic authentication on a server and use pf cookies,see below
function auth(req, res, next) {
  console.log(req.session);

  if (!req.session.user) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
          const err = new Error('You are not authenticated!');
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 401;
          return next(err);
      }

      const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      const user = auth[0];
      const pass = auth[1];
      if (user === 'admin' && pass === 'password') {
          req.session.user = 'admin';
          return next(); // authorized
      } else {
          const err = new Error('You are not authenticated!');
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 401;
          return next(err);
      }
  } else {
      if (req.session.user === 'admin') {
          return next();
      } else {
          const err = new Error('You are not authenticated!');
          err.status = 401;
          return next(err);
      }
  }
}

app.use(auth);

// Authentication above

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;