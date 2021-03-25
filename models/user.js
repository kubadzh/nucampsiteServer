//new Mongoose model for the users collection

const mongoose = require('mongoose');

const passportLocalMongoose = require('passport-local-mongoose'); // importing local plugin, this plugin will handle adding, hashing and salting username and password plugins

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    facebookId: String, // We will associate FB Id with user account, and this will be unique Id that FB assigned to each user's account
    admin: { // Field #3
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('User', userSchema); // Collection will automatically named 'users'

// We will associate FB Id with user account, and this will be unique Id that FB assigned to each user's account