const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;


const promotionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    featured: { // featured field
        type: Boolean,
        default: false
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
        
    
}, {
    timestamps: true //The timestamps option tells mongoose to assign createdAt and updatedAt fields to your schema. The type assigned is Date.
});


// we create a model using a schema
const Promotion = mongoose.model('Promotion ', promotionSchema); // Model: Create a Model named Promotion from this Schema. 

module.exports = Promotion; // Export: Export the Promotion Model from this module. 