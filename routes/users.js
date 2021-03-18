
//to support user registration, login, and logout:

const express = require('express');
const User = require('../models/user');

const passport = require('passport');


const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/signup', (req, res) => { // this will alow a new user to register on our website
    User.register(
        new User({username: req.body.username}), // new user
        req.body.password, // password that we plug directly from incoming
        err => {
            if (err) { // if there was an err internally when trying register
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
            } else { // if no err, then we will authenticate a new user
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, status: 'Registration Successful!'});
                });
            }
        }
    );
    /* User.findOne({username: req.body.username}) // we check if username is already taken, by using a static method 'findOne'
    .then(user => {
        if (user) {
            const err = new Error(`User ${req.body.username} already exists!`);
            err.status = 403;
            return next(err);
        } else {
            User.create({
                username: req.body.username,
                password: req.body.password})
            .then(user => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({status: 'Registration Successful!', user: user});
            })
            .catch(err => next(err));
        }
    })
    .catch(err => next(err)); */
});

router.post('/login', passport.authenticate('local'), (req, res) => {// adding middleware 'passport.authenticate('local'),' will allow passport authentication on this route, and will handle loging the user
res.statusCode= 200;
res.setHeader('Content-Type', 'application/json');
res.json({success: true, status: 'You are successfully logged in!'});
});
/*router.post('/login', (req, res, next) => {
    if(!req.session.user) { // we check if user has already checked in
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            const err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        }
      
        const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const username = auth[0];
        const password = auth[1];
      // we take username and password that the client is sending us and check it against user documents that we have in database
      // if we find a user document that has a matching username & password, we can successfully authenticate this login
        User.findOne({username: username}) 
        .then(user => {
            if (!user) {
                const err = new Error(`User ${username} does not exist!`);
                err.status = 401;
                return next(err);
            } else if (user.password !== password) {
                const err = new Error('Your password is incorrect!');
                err.status = 401;
                return next(err);
            } else if (user.username === username && user.password === password) {
                req.session.user = 'authenticated';
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('You are authenticated!')
            }
        })
        .catch(err => next(err));
    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are already authenticated!');
    }
}); */

// We use .get, becasue client is not submitting any info to the server
// such as username and password, "Hey, I am out, you can stop tracking my session now..."
router.get('/logout', (req, res, next) => {
    if (req.session) {
        req.session.destroy(); // we are deleteing session file on the server-side
        res.clearCookie('session-id'); // this will clear the cookie thats been store on the client
        res.redirect('/'); // this will redirect user to this route path, eg.g localhost/3000/
    } else {
        const err = new Error('You are not logged in!');
        err.status = 401;
        return next(err);
    }
});

module.exports = router;