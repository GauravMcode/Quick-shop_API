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
    cart: {
        total: { type: Number },
        number: { type: Number },
        items: [{
            id: { type: mongoose.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number },
        }
        ]
    }

})

module.exports = mongoose.model('User', userSchema);