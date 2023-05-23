const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = Schema({
    name: { type: String },
    mobile: { type: String },
    email: { type: String },
    line1: { type: String },
    line2: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    details: {
        total: { type: Number },
        number: { type: Number },
        items: [{
            id: { type: Object },
            quantity: { type: Number },
        }
        ]
    },
    invoiceLink: { type: String }
})

module.exports = mongoose.model('Order', orderSchema);