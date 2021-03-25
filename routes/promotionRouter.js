const express = require("express");
const Promotion = require("../models/promotion"); // now we can use Promotion model that is exported from partner module

const promotionRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors'); // importing cors module

promotionRouter.route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200)) // this method will deal with pre-flight requests
.get(cors.cors, (req, res, next) => {
    // we pass next f as an arg
    Promotion.find()
      .then((promotions) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotions);
      })
      .catch((err) => next(err)); // this will make express handle the err
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.create(req.body) // this will create a new promotion document and save it to the mongodb server, we wil create this doc from request body whihc should contain info for the promotion
      .then((promotion) => {
        console.log("Promotion Created", promotion);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
      })
      .catch((err) => next(err));
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403; // when operation not supported
    res.end("PUT operation not supported on /promotions");
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    // delete operation
    Promotion.deleteMany()
      .then((response) => {
        // this method to access the return value from this operation
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

promotionRouter.route("/:promotionId")
  // 4 methods to handle endpints , Workshop Week 1

  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200)) // this method will deal with pre-flight requests
.get(cors.cors, (req, res, next) => {
    // allows us to store whatever client sends as a part of the path after the '/ ' as a rout parameter named 'campsiteId'
    Promotion.findById(req.params.promotionId)
      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
      })
      .catch((err) => next(err));
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /promotions/${req.params.promotionId}`
    );
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.findByIdAndUpdate(
      req.params.promotionId,
      {
        $set: req.body,
      },
      { new: true }
    ) // here we are passing an object with the property of 'new' set to 'true', so we can get back the info with the updated document as the result of this method

      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
      })
      .catch((err) => next(err));
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    // passing a callback with the param 'req' and 'res'
    Promotion.findByIdAndDelete(req.params.promotionId)
      .then((responce) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(responce);
      })
      .catch((err) => next(err));
  });

module.exports = promotionRouter;
