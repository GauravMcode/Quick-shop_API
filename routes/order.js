const express = require('express');

const orderController = require('./../controllers/order');
const authController = require('./../controllers/auth');

const router = express.Router();

router.get('/payment/:type', [authController.isAuth, orderController.paymentReq]);
router.post('/payment/:type', [authController.isAuth, orderController.paymentDone, orderController.createInvoice, orderController.invoiceLink]);
router.get('/orders/:type', [authController.isAuth, orderController.getOrders]);


module.exports = router;