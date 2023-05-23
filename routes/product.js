const express = require('express');

const prodController = require('./../controllers/product');
const authController = require('./../controllers/auth');


const router = express.Router();

router.post('/add-product/:type', [authController.isAuth, prodController.addProduct]);
router.get('/products/:type', [authController.isAuth, prodController.getAllProducts]);
router.get('/products/:type/:search', [authController.isAuth, prodController.searchProducts]);
router.get('/user-products/:limit/:type', [authController.isAuth, prodController.getLimitProducts]);
router.get('/product/:prodId/:type', [authController.isAuth, prodController.getProduct]);
router.delete('/delete-product/:prodId/:type', [authController.isAuth, prodController.deleteProduct]);

router.post('/review/:type', [authController.isAuth, prodController.addReview]);
router.post('/update-view-metrics/:type', [authController.isAuth, prodController.updateMetrics])

module.exports = router; 
