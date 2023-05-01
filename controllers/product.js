const mongoose = require("mongoose")
const Product = require("../models/product")

exports.addProduct = async (req, res, next) => {
    //to update
    if (req.body._id) {
        let product = await Product.findById(req.body._id);
        product.title = req.body.title;
        product.description = req.body.description;
        product.imageUrl = req.body.imageUrl;
        product.price = req.body.price;
        product.quantity = req.body.quantity;
        const result = await product.save();
        return res.status(201).json({
            'data': result
        })
    }

    //to add new product
    const product = new Product({
        _id: req.body._id,
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        quantity: req.body.quantity,
        sales: req.body.sales,
        views: req.body.views,
        adminId: req.body.adminId,
    });
    try {
        let result = await product.save();
        return res.status(201).json({
            'data': result
        });
    } catch (error) {
        return error500(error, 500);
    }
}


exports.getAllProducts = async (req, res, next) => {
    const id = new mongoose.Types.ObjectId(req.userId);
    try {
        const products = await Product.find({ adminId: id });
        return res.status(200).json({
            'data': products
        });
    } catch (error) {
        return error500(error, 500);
    }

}

exports.getProduct = async (req, res, next) => {
    const id = req.params.prodId;
    try {
        const product = await Product.findById(id);
        return res.status(200).json({
            'data': product
        });

    } catch (error) {
        return error500(error, 500);
    }

}

exports.deleteProduct = async (req, res, next) => {
    const id = req.params.prodId;
    try {
        let product = await Product.findByIdAndDelete(id);
        console.log(product);
        return res.status(200).json({
            'data': product.id
        });
    } catch (error) {
        return error500(error, 500);
    }
}

exports.getLimitProducts = async (req, res, next) => {
    const limit = Number.parseInt(req.params.limit);
    const page = Number.parseInt(req.query.page);
    const productCount = await Product.countDocuments();
    const count = Math.ceil(productCount / limit);
    try {
        const products = await Product.find({}, { sales: 0, views: 0 }).skip(page * limit).limit(limit); //excluding sales and views
        res.status(200).json({
            'data': products,
            'count': count
        })
    } catch (error) {
        error500(error, 500);
    }
}

























const error500 = (err, status) => {
    const error = new Error();
    error.message = err;
    error.statusCode = error.statusCode || status;
    return error;
}