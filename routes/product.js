const express = require('express');

const prodController = require('./../controllers/product');
const authController = require('./../controllers/auth');


const router = express.Router();

router.post('/add-product', [authController.isAuth, prodController.addProduct]);
router.get('/products', [authController.isAuth, prodController.getAllProducts]);
router.get('/user-products/:limit', [authController.isAuth, prodController.getLimitProducts]);
router.get('/product/:prodId', [authController.isAuth, prodController.getProduct]);
router.delete('/delete-product/:prodId', [authController.isAuth, prodController.deleteProduct]);

module.exports = router; 
