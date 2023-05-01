const express = require('express');

const userController = require('./../controllers/user');
const authController = require('./../controllers/auth');

const router = express.Router();

router.post('/user', [authController.isAuth, userController.getUser]);
router.post('/cart', [authController.isAuth, userController.cart]);


module.exports = router;