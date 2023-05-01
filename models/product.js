const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let productSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    sales: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        required: true
    },
    adminId: {
        type: mongoose.Types.ObjectId,
        ref: 'Admin',
        required: true

    },
});

module.exports = mongoose.model('Product', productSchema);