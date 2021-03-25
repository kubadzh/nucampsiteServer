const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

const JwtStrategy = require('passport-jwt').Strategy; // We are importing JwtStrategy constructor froom the library
const ExtractJwt = require('passport-jwt').ExtractJwt; // This module/object
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const FacebookTokenStrategy = require('passport-facebook-token');


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

//Implementing Facebook Token Strategy

exports.facebookPassport = passport.use(
    new FacebookTokenStrategy( // This constructor, we are getting this from config module
        {
            clientID: config.facebook.clientId, // FB app Id
            clientSecret: config.facebook.clientSecret // FB app secrect, we are getting this from config module
        }, 
        (accessToken, refreshToken, profile, done) => { //verify callback f with 4 arguments
            User.findOne({facebookId: profile.id}, (err, user) => { // we 1st check if we already have a userId in our mongoDb, we look for matching facebookId, The 'profile.id' object that is passed in here
                if (err) {
                    return done(err, false);
                }
                if (!err && user) { // If there is no err but the user already exit in the db 
                    return done(null, user); //null for no err and user document
                } else {  // this will handle- there is no err and no user, current user's fbId could not be found in the user collection of our db
                    user = new User({ username: profile.displayName }); // create new user document, we will obtain usernam from the profile object that we received from fb
                    user.facebookId = profile.id;
                    user.firstname = profile.name.givenName;
                    user.lastname = profile.name.familyName;
                    user.save((err, user) => { // we are saving the new user document to the mongoDb
                        if (err) { 
                            return done(err, false); // This will let us know, if there is an err with creating a new user document
                        } else {
                            return done(null, user); // if no err, then callback with null and user
                        }
                    });
                }
            });
        }
    )
);