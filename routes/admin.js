const express = require('express');

const authController = require('./../controllers/auth');
const adminController = require('./../controllers/admin');

const router = express.Router();

router.get('/metrics/:type', [authController.isAuth, adminController.getMetrics]);

module.exports = router;