const express = require('express');

const authController = require('./../controllers/auth');

const router = express.Router();

router.post('/sign-up', authController.signUp);
router.post('/sign-in', authController.signIn);

router.post('/reset-otp', authController.resetPassword);
router.post('/reset', authController.checkReset);

module.exports = router;