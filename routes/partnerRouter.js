const express = require('express');
const partnerRouter = express.Router();
const Partner = require('../models/partner'); // now we can use Partner model that is exported from partner module
const authenticate = require('../authenticate');
const cors = require('./cors');

partnerRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200)) // this method will deal with pre-flight requests
.get(cors.cors, (req, res, next) => {
    Partner.find()
      .then((partners) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners);
      })
      .catch((err) => next(err)); // this will pass off the err to overall err handler for this express app, and let express handle this err
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Partner.create(req.body)
      .then((partner) => {
        console.log('Partner Created', partner);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner); // to send info about the posted document to the client
      })
      .catch((err) => next(err));
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => { // By adding authenticate.verifyAdmin, we ensure this routes require admin authentification
    res.statusCode = 403; // when operation not supported
    res.end('PUT operation not supported on /partners');
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    // delete operation // we pass next f for the err handling
    Partner.deleteMany() // static method with empty param, whihc results in every doc in partner collection being deleted
      .then(response => {
        // this method to access the return value from this operation
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
      })
      .catch((err) => next(err));
  });

partnerRouter.route('/:partnerId')
  // 4 methods to handle endpints , Workshop Week 1

  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200)) // this method will deal with pre-flight requests
.get(cors.cors, (req, res, next) => {
    // allows us to store whatever client sends as a part of the path after the '/ ' as a rout parameter named 'campsiteId'
    Partner.findById(req.params.partnerId)
      .then((partner) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
      })
      .catch((err) => next(err));
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /partners/${req.params.partnerId}`
    );
  })

  // name and description is coming from postman object {'name': 'test', 'description': 'test description'} //
  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Partner.findByIdAndUpdate(
      req.params.partnerId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((partner) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
      })
      .catch((err) => next(err));
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    // passing a callback with the param 'req' and 'res'
    Partner.findByIdAndDelete(req.params.partnerId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
      })
      .catch((err) => next(err));
  });

module.exports = partnerRouter;
