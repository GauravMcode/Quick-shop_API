const mongoose = require("mongoose")
const Product = require("../models/product")
const User = require("../models/user")

exports.addProduct = async (req, res, next) => {
    //to update
    if (req.body._id) {
        let product = await Product.findById(req.body._id);
        product.title = req.body.title;
        product.description = req.body.description;
        product.imageUrl = req.body.imageUrl;
        product.price = req.body.price;
        product.quantity = req.body.quantity;
        product.category = req.body.category;
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
        category: req.body.category,
        sales: req.body.sales,
        views: req.body.views,
        adminId: req.body.adminId,
        averageRating: 0.0,
        reviews: [],
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
    const category = req.query.category;
    const productCount = await Product.countDocuments();
    const count = Math.ceil(productCount / limit);
    try {
        const products = category == 'All' ?
            await Product.find({}, { sales: 0, views: 0 }).skip(page * limit).limit(limit) :
            await Product.find({ category: category }, { sales: 0, views: 0 }).skip(page * limit).limit(limit); //excluding sales and views
        res.status(200).json({
            'data': products,
            'count': count
        })
    } catch (error) {
        console.log(error);
        error500(error, 500);
    }
}

exports.searchProducts = async (req, res, next) => {
    let search = req.params.search;

    try {
        let products = await Product.find({ title: { $regex: new RegExp(`${search}`, "i") } }).limit(3);
        res.status(200).json({
            'data': products
        })
    } catch (error) {
        console.log(error, 500);
    }
}

exports.addReview = async (req, res, next) => {
    console.log('adding review');
    const prodId = req.body.prodId;

    try {
        let product = await Product.findById(prodId);
        product.reviews.push({
            name: req.body.name,
            rating: req.body.rating,
            review: req.body.review,
        });
        product.averageRating = (product.averageRating + req.body.rating) / product.reviews.length;
        const updatedProduct = await product.save();
        res.status(201).json({
            'data': updatedProduct
        });
    } catch (error) {
        console.log(error);
        error500(error, 500);
    }

}

exports.updateMetrics = async (req, res, next) => {
    console.log('metrics update');
    const userId = req.userId;
    const prodId = new mongoose.Types.ObjectId(req.body.prodId);
    const user = await User.findById(userId);
    if (user.viewedProducts.includes(prodId)) {
        console.log('User already exists');
        return res.json({
            'data': 'success'
        })
    }
    user.viewedProducts.push(prodId);
    let product = await Product.findById(prodId);
    console.log(user.viewedProducts);
    product.views = product.views + 1;
    await user.save();
    await product.save();
    return res.json({
        'data': 'success'
    })


}



















const error500 = (err, status) => {
    const error = new Error();
    error.message = err;
    error.statusCode = error.statusCode || status;
    return error;
}