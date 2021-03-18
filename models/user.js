//new Mongoose model for the users collection

const mongoose = require('mongoose');

const passportLocalMongoose = require('passport-local-mongoose'); // importing local plugin, this plugin will handle adding, hashing and salting username and password plugins

const Schema = mongoose.Schema;

const userSchema = new Schema({
   
    admin: { // Field #3
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('User', userSchema); // Collection will automatically named 'users'