const express = require('express');
const promotionRouter = express.Router();

promotionRouter.route('/')

    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })

    .get((req, res) => {
        res.end('Will send all the promotions to you');
    })

    .post((req, res) => {
        res.end(`Will add the promotions:  with description: `); // Use backtiks 
    })

    .put((req, res) => { 
        res.statusCode = 403;   // when operation not supported
        res.end('PUT operation not supported on /promotions');
    })

    .delete((req, res) => {   // delete operation 
        res.end('Deleting all promotions');
});


promotionRouter.route('/:promotionId') 
// 4 methods to handle endpints , Workshop Week 1
        .all((req, res, next) => { 
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            next();
        })
        .get((req, res) => {  // allows us to store whatever client sends as a part of the path after the '/ ' as a rout parameter named 'campsiteId'
            res.end(`Will send details of the promotion: ${req.params.promotionId} to you`);
        })

        .post((req, res) => {
            res.statusCode = 403;
            res.end(`POST operation not supported on /promotions/${req.params.promotionId}`);
        })

        .put((req, res) => {
            
            res.write(`Updating the promotion: ${req.params.promotionId}\n`); 
            res.end(`Will update the promotion: ${req.body.name}
                with description: ${req.body.description}`);
        })

        .delete((req, res) => {  // passing a callback with the param 'req' and 'res'
            res.end(`Deleting promotion: ${req.params.promotionId}`);
});

module.exports = promotionRouter;  