var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');


const passport = require('passport');
const config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

const uploadRouter = require('./routes/uploadRouter');

const mongoose = require('mongoose');



const url = config.mongoUrl; // url for mongodb server. We setup url in config.js
const connect = mongoose.connect(url, { // we setup a connection
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'), // handling promise
    err => console.log(err)
);

//Creating express application
var app = express();

// Secure traffic only. Redirect any traffic coming to insecure port to the secure one
// we are catching any requests. We are using wildcart *
app.all('*', (req, res, next) => {
  if (req.secure) { // secure property is set automatically to true
    return next();
  } else { // if connection is not secure then we do else
      console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
      res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
  }
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//  app.use(cookieParser('12345-67890-09876-54321')); // there might me an issue if we use cookie=parser and express-session together


// *** Here we use session middleware 'app.use', options below are commonly set
/*app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false, // when new session is created, but then no updates are made to it, then at the end of the request it won't get saved, because it will just be an empty session without any usefull information and also no cookie will be sent to the client, that helps to prevent to have bunch of empty files and cookies being setup
  resave: false, // once the seesion has bee created it will continue to be re-saved whenever request has been made to that session, even if that req didnt make any updates that needed to be saved
  store: new FileStore() // this will create a new FileStore as an object that we use to save our session infomration to the servers hard disk, instead of just running the apps memmory. You will see a session folder in VS Code, where session info is stored. 
}));*/


// Middleware f provided by passport to check incoming requests to see if there is existing session for the client, 
//if so, the session data for the client is loaded into the client as req.user
app.use(passport.initialize());
//app.use(passport.session());//passport.session()-middleware


//Below two are placed above the auth f
app.use('/', indexRouter);
app.use('/users', usersRouter);
/*// Basic authentication on a server and use of sessions,see below
function auth(req, res, next) {
  console.log(req.user);

  if (!req.user) {
        const err = new Error('You are not authenticated!');
        err.status = 401;
        return next(err);

  } else {
          return next();
  }
}

app.use(auth);

// Authentication above */

app.use(express.static(path.join(__dirname, 'public')));

//Routers for the endpoints 
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);
app.use('/imageUpload', uploadRouter);

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