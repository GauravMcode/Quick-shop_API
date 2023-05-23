const express = require('express');

const userController = require('./../controllers/user');
const authController = require('./../controllers/auth');

const router = express.Router();

router.get('/user/:type', [authController.isAuth, userController.getUser]);
router.post('/user-update/:type', [authController.isAuth, userController.updateUser]);
router.post('/cart/:type', [authController.isAuth, userController.cart]);
router.post('/wishlist/:action/:type', [authController.isAuth, userController.wishList]);


module.exports = router;