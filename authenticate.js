const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');


//Whenever we use passport in our sessions we need to use
//serialize and deserialize
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());