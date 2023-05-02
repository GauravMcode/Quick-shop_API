const User = require('../models/user');

const stripe = require('stripe')(process.env.STRIPE_KEY);

exports.payment = async (req, res, next) => {
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
        console.log(customerId);
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customerId },
            { apiVersion: '2022-11-15' }
        )
        console.log(ephemeralKey);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'INR',
            customer: customerId,
        })
        console.log(paymentIntent);
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

const error500 = (err, status) => {
    const error = new Error();
    error.message = err;
    error.statusCode = error.statusCode || status;
    return error;
}