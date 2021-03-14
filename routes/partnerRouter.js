const express = require('express');
const partnerRouter = express.Router();
const Partner = require('../models/partner'); // now we can use Partner model that is exported from partner module



partnerRouter
  .route('/')
  .get((req, res, next) => {
    Partner.find()
      .then((partners) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners);
      })
      .catch((err) => next(err)); // this will pass off the err to overall err handler for this express app, and let express handle this err
  })

  .post((req, res, next) => {
    Partner.create(req.body)
      .then((partner) => {
        console.log('Partner Created', partner);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner); // to send info about the posted document to the client
      })
      .catch((err) => next(err));
  })

  .put((req, res) => {
    res.statusCode = 403; // when operation not supported
    res.end('PUT operation not supported on /partners');
  })

  .delete((req, res, next) => {
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

partnerRouter
  .route('/:partnerId')
  // 4 methods to handle endpints , Workshop Week 1

  .get((req, res, next) => {
    // allows us to store whatever client sends as a part of the path after the '/ ' as a rout parameter named 'campsiteId'
    Partner.findById(req.params.partnerId)
      .then((partner) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
      })
      .catch((err) => next(err));
  })

  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /partners/${req.params.partnerId}`
    );
  })

  // name and description is coming from postman object {'name': 'test', 'description': 'test description'} //
  .put((req, res, next) => {
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

  .delete((req, res, next) => {
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
