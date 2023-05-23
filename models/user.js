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
    cart: {
        total: { type: Number },
        number: { type: Number },
        items: [{
            id: { type: mongoose.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number },
        }
        ]
    },
    addressList: [
        {
            name: String,
            mobile: String,
            line1: String,
            line2: String,
            city: String,
            state: String,
            country: String,
        }
    ],
    wishList: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
    viewedProducts: [{ type: mongoose.Types.ObjectId, ref: 'Product' }]

})

module.exports = mongoose.model('User', userSchema);