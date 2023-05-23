const stripe = require('stripe')(process.env.STRIPE_KEY);

const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');
const { generateInvoice } = require('../utils/invoice');


exports.paymentReq = async (req, res, next) => {
    let customerId;
    const user = await User.findById(req.userId);
    const amount = user.cart.total * 100;
    try {
        const customerList = await stripe.customers.list({
            email: req.email,
            limit: 1
        });

        if (customerList.data.length != 0) {
            customerId = customerList.data[0].id;
        } else {
            const customer = await stripe.customers.create({
                email: req.email
            });
            customerId = customer.data.id;
        }
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customerId },
            { apiVersion: '2022-11-15' }
        )
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'INR',
            customer: customerId,
        })
        res.status(200).json({
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customerId,
            success: true,
        })

    } catch (error) {
        console.log(error);
        error500('payment failed', 400);
    }
}

exports.paymentDone = async (req, res, next) => {
    const id = req.userId;
    try {
        let user = await User.findById(id).populate('cart.items.id');
        const details = user.cart;
        //update metrics
        await details.items.forEach(async (item) => {
            let product = await Product.findById(item.id['_id']);
            product.sales = product.sales + item.quantity;
            console.log(product.sales);
            await product.save();
        });
        // const records = await Product.find({ '_id': { $in: products } });
        const order = Order({
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            line1: req.body.line1,
            line2: req.body.line2,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            details: details,
            invoiceLink: "",
        });
        user.cart = { 'total': 0, 'number': 0, 'items': [] };
        await user.save();
        const savedOrder = await order.save();
        req.order = savedOrder;

        next();
    } catch (e) {
        console.log(e);
    }
}

exports.createInvoice = async (req, res, next) => {
    await generateInvoice(req.order, next);
}

exports.invoiceLink = async (req, res, next) => {
    const id = req.order._id
    const order = await Order.findById(id);
    const link = order.invoiceLink;
    console.log(link);
    res.status(200).json({
        'invoice': link
    })
}

exports.getOrders = async (req, res, next) => {
    const email = req.email;
    const orders = await Order.find({ email: email });
    res.status(200).json({
        'orders': orders
    })
}
const error500 = (err, status) => {
    const error = new Error();
    error.message = err;
    error.statusCode = error.statusCode || status;
    return error;
}