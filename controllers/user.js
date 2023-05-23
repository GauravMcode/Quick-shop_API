const User = require('../models/user');
const Admin = require('../models/admin');
const Product = require('../models/product');
const bodyParser = require('body-parser');

exports.getUser = async (req, res, next) => {
    const type = req.params.type;
    const id = req.userId;
    try {
        if (type == 'user') {
            let user = await User.findById(id).populate('cart.items.id').populate('wishList');
            return res.status(200).json({
                'data': user
            })
        }
        const admin = await Admin.findById(id);
        return res.status(200).json({
            'data': admin
        })

    } catch (error) {
        return error500(error, 500);
    }

}

exports.updateUser = async (req, res, next) => {
    const type = req.params.type;
    const id = req.userId;
    const changes = req.body;
    try {
        if (type == 'user') {
            let user = await User.findById(id).populate('cart.items.id');
            user.name = changes['name'];
            user.addressList = changes['addressList'];
            user.imageUrl = changes['imageUrl'];
            await user.save();
            return res.status(200).json({
                'data': user
            })
        }
        let admin = await Admin.findById(id);
        admin.name = changes['name'];
        admin.imageUrl = changes['imageUrl']
        await admin.save();
        return res.status(200).json({
            'data': admin
        })
    } catch (error) {

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
        if (total == 0 && number == 0 && task == 'delete') {
            return res.status(404).json({
                'message': 'no product found'
            })
        }

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
            if (user.cart.number == 0) {
                user.cart.total = 0;
                user.items = [];
            }
            const result = await user.save();
            let data = await result.populate('cart.items.id');
            // data = data.cart.items.map((i) => { return { product: { ...i.id._doc } } }) //to remove meta-data
            return res.status(201).json({
                'data': data
            })
        }

        //if product is not there in cart, add the product
        cart.items.push({ 'id': prodId, 'quantity': 1 });
        user.cart = cart;
        if (user.cart.number == 0) {
            user.cart.total = 0;
            user.items = [];
        }
        let result = await user.save();
        let data = await result.populate('cart.items.id');
        // data.cart.items = data.cart.items.map((i) => { return { product: { ...i.id._doc } } }) //to remove meta-data
        return res.status(201).json({
            'data': data
        })
    } catch (e) {
        console.log(e);
        return error500(e, 500);
    }
}

exports.wishList = async (req, res, next) => {
    const action = req.params.action;
    const id = req.userId;
    const prodId = req.body.prodId;
    let user = await User.findById(id);
    console.log(action);
    //check  if the product already exists in wish-list, if yes and action is delte then remove it
    user.wishList.forEach(async (e) => {
        if (e.toString() === prodId && action == 'delete') {
            user.wishList = user.wishList.filter((e) => {
                return e.toString() !== prodId;
            })
            console.log(user.wishList);
            await user.save();
        }
    })

    //if product already doesn't exist in wishlist and action is add
    if (!user.wishList.includes(prodId) && action == 'add') {
        user.wishList.push(prodId);
        await user.save();

    }
    return this.getUser(req, res, next);
}



const error500 = (err, status) => {
    const error = new Error();
    error.message = err;
    error.statusCode = error.statusCode || status;
    return error;
}