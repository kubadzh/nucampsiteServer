//new Mongoose model for the users collection

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { //Field #1
        type: String,
        required: true,
        unique: true
    },
    password: { //Field #2
        type: String,
        required: true
    },
    admin: { // Field #3
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema); // Collection will automatically named 'users'