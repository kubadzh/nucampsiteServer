const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    campsites: [{ // property of campsite // By enclosing in an array with [] brackets, this will allow us to store an array of campsiteIds in this field
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campsite'
    }]
}, {
    timestamps: true // mongoose will take care of createdAt, updatedAt
});

// we create a model using a schema
const Favorite  = mongoose.model('Favorite', favoriteSchema); // Model: Create a Model named Favorite from this Schema. 

module.exports = Favorite ; // Export: Export the Favorite  Model from this module. 