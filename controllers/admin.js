const Product = require("../models/product");

exports.getMetrics = async (req, res, next) => {
    console.log('preparing metrics..');
    const adminId = req.userId;
    const products = await Product.find({ adminId: adminId });
    var viewData = new Object();
    var salesData = new Object();
    var revenueData = new Object();
    var totalViews = 0;
    var totalSales = 0;
    var totalRevenue = 0;
    var milestone = "Grand";
    products.forEach((product) => {
        const category = product.category;
        totalViews = totalViews + product.views;
        totalSales = totalSales + product.sales;
        totalRevenue = totalRevenue + product.sales * product.price;
        if (category in viewData) {
            viewData[`${category}`] = viewData[`${category}`] + product.views;
        } else {
            viewData[`${category}`] = product.views;
        }

        if (category in salesData) {
            salesData[`${category}`] = salesData[`${category}`] + product.sales;
        } else {
            salesData[`${category}`] = product.sales;
        }

        if (category in revenueData) {
            revenueData[`${category}`] = revenueData[`${category}`] + product.sales * product.price;
        } else {
            revenueData[`${category}`] = product.sales * product.price;
        }
    })
    switch (salesData) {
        case salesData >= 100000:
            milestone = "Pro";
            break;
        case salesData >= 1000000:
            milestone = "Legend";
            break;

        default:
            milestone = "Grand";
            break;
    }
    return res.json({
        views: viewData,
        sales: salesData,
        revenue: revenueData,
        totalViews: totalViews,
        totalSales: totalSales,
        totalRevenue: totalRevenue,
        milestone: milestone
    })
}

const error500 = (err, status) => {
    const error = new Error();
    error.message = err;
    error.statusCode = error.statusCode || status;
    return error;
}