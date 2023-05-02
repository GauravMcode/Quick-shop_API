const express = require('express');

const orderController = require('./../controllers/order');
const authController = require('./../controllers/auth');

const router = express.Router();

router.get('/payment', [authController.isAuth, orderController.payment]);


module.exports = router;