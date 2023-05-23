const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let userSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: false,

    },
    imageUrl: {
        type: String
    },
    addressList: [
        { type: String }
    ]

})

module.exports = mongoose.model('Admin', userSchema);