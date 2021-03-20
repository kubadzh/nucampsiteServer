const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

//
const JwtStrategy = require('passport-jwt').Strategy; // We are importing JwtStrategy constructor froom the library
const ExtractJwt = require('passport-jwt').ExtractJwt; // This module/object
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const config = require('./config.js');

//Whenever we use passport in our sessions we need to use
//serialize and deserialize
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600}); // sign() is part of JSON web token API
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // this methods specifies how json web token should be extracted from the message
opts.secretOrKey = config.secretKey;


//Setup of JSON Web Token for passport
exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);
//we use this f to verify that the incoming request
//is from an authenticated user
//'jwt' - we indicate that we want to use JSON Web Token strategy
//{session: false} - we are not using sessions
exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin){
        return next();
    } else {
        const err = new Error('You are not authorized to perform this operation!');
        err.status = 403 ;
        return next(err);
    }
};
