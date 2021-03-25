// We will configure cors module here
//configure your Express server to support cross-origin resource sharing by setting up two different 
////middleware functions: first, the default cors method from the cors Node module, and second, 
//a custom cors method configured with a whitelist. Then you updated the Express routers to respond to preflight 
//messages from a client, as well as use the cors middleware to respond with the correct headers to cross-origin requests.
const cors = require('cors');

const whitelist = ['http://localhost:3000', 'https://localhost:3443']; 
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors(); // this will return middleware f configure to set cors header.
exports.corsWithOptions = cors(corsOptionsDelegate); // this f will check if the incoming request belongs to whitelisted origins