const express = require('express');
const partnerRouter = express.Router();

partnerRouter.route('/')

    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })

    .get((req, res) => {
        res.end('Will send all the partners to you');
    })

    .post((req, res) => {
        res.end(`Will add the partners:  with description:`); // Use backtiks 
    })

    .put((req, res) => { 
        res.statusCode = 403;   // when operation not supported
        res.end('PUT operation not supported on /partners');
    })

    .delete((req, res) => {   // delete operation 
        res.end('Deleting all partners');
});


partnerRouter.route('/:partnerId') 
// 4 methods to handle endpints , Workshop Week 1
        .all((req, res, next) => { 
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            next();
        })
        .get((req, res) => {  // allows us to store whatever client sends as a part of the path after the '/ ' as a rout parameter named 'campsiteId'
            res.end(`Will send details of the partner: ${req.params.partnerId} to you`);
        })

        .post((req, res) => {
            res.statusCode = 403;
            res.end(`POST operation not supported on /partners/${req.params.partnerId}`);
        })


        // name and description is coming from postman object {"name": "test", "description": "test description"} // 
        .put((req, res) => {
            
            res.write(`Updating the partner: ${req.params.partnerId}\n`); 
            res.end(`Will update the partner: ${req.body.name} 
                with description: ${req.body.description}`);
        })

        .delete((req, res) => {  // passing a callback with the param 'req' and 'res'
            res.end(`Deleting partner: ${req.params.partnerId}`);
});

module.exports = partnerRouter;  