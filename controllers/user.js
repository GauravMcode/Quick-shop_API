const User = require('../models/user');
const Admin = require('../models/admin');
const Product = require('../models/product');

exports.getUser = async (req, res, next) => {
    const type = req.body.type;
    const Model = type == 'user' ? User : Admin;
    const id = req.userId;
    try {
        const user = await Model.findById(id);
        if (user.cart.number != 0) {
            let data = await result.populate('cart.items.id');
            user = data.cart.items.map((i) => { return { product: { ...i.id._doc } } }) //to remove meta-data
            console.log(user);
        }
        return res.status(200).json({
            'data': user
        })
    } catch (error) {
        return error500(error, 500);
    }

}

//to handle adding and deleting from cart
exports.cart = async (req, res, next) => {
    const id = req.userId;
    const prodId = req.body.prodId;
    const task = req.body.task;

    try {
        let product = await Product.findById(prodId); //get the product
        let user = await User.findById(id);  //get the user

        let cart = user.cart; //make changes to cart
        let total = cart.total;
        let number = cart.number;

        cart.total = task == 'add' ? total + product.price : total == 0 ? 0 : total - product.price;
        cart.number = task == 'add' ? number + 1 : number == 0 ? 0 : number - 1;
        var prodElement;

        cart.items.forEach(element => {
            if (element.id == prodId) {
                prodElement = element;
            }
        });


        let indexOfId = cart.items.indexOf(prodElement);

        //if product is already present, so just increase the quantity
        if (prodElement) {
            let quantity = cart.items[indexOfId].quantity;
            if (quantity == 1 && task == 'delete') {
                cart.items = cart.items.filter(function (element) {
                    return element.id !== cart.items[indexOfId].id;
                });
            } else {
                cart.items[indexOfId].quantity = task == 'add' ? quantity + 1 : quantity - 1;
            }

            user.cart = cart;
            const result = await user.save();
            let data = await result.populate('cart.items.id');
            data = data.cart.items.map((i) => { return { product: { ...i.id._doc } } }) //to remove meta-data
            return res.status(201).json({
                'data': result
            })
        }

        //if product is not there in cart, add the product
        console.log(cart.items);
        cart.items.push({ 'id': prodId, 'quantity': 1 });
        user.cart = cart;
        let result = await user.save();
        let data = await result.populate('cart.items.id');
        data.cart.items = data.cart.items.map((i) => { return { product: { ...i.id._doc } } }) //to remove meta-data
        return res.status(201).json({
            'data': data
        })
    } catch (e) {
        console.log(e);
        return error500(e, 500);
    }
}



const error500 = (err, status) => {
    const error = new Error();
    error.message = err;
    error.statusCode = error.statusCode || status;
    return error;
}