
//to support user registration, login, and logout:

const express = require('express');
const User = require('../models/user');

const passport = require('passport');
const authenticate = require('../authenticate');


const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/signup', (req, res) => { // this will alow a new user to register on our website
    User.register(
        new User({username: req.body.username}), // new user
        req.body.password, // password that we plug directly from incoming
        (err, user) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
            } else {
                if (req.body.firstname) {
                    user.firstname = req.body.firstname;
                }
                if (req.body.lastname) {
                    user.lastname = req.body.lastname;
                }
                user.save(err => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({err: err});
                        return;
                    }
                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, status: 'Registration Successful!'});
                    });
                });
            }
        }
    );
});
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


// We are using a local strategy to authenticate the user
router.post('/login', passport.authenticate('local'), (req, res) => {// adding middleware 'passport.authenticate('local'),' will allow passport authentication on this route, and will handle loging the user
    const token = authenticate.getToken({_id: req.user._id});//Once user is authenticated, we issue a token. We are passing an object that contains a payload
    res.statusCode= 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'}); // Once we have a token we include it in the responce to the client, by adding token prop to the responce object like this 'token: token'
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