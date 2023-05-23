const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');

const welocme = require('../utils/emails/welcome');
const reset = require('../utils/emails/resetPassword');

//Registers user
exports.signUp = async (req, res, next) => {
    const type = req.body.type;
    const Model = type == 'user' ? User : Admin;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const cart = { 'total': 0, 'number': 0, 'items': [] }
    try {
        //Get user
        const alreadyUser = await Model.findOne({ email: email });
        if (alreadyUser) {
            return next(error500('Email already exists', 401));
        }
        const hashPassword = await bcrypt.hash(password, 12);

        const user = Model == User ?
            new Model({  //user
                name: name,
                email: email,
                password: hashPassword,
                cart: cart,
                addressList: [],
                imageUrl: 'https://firebasestorage.googleapis.com/v0/b/flutter-shop-f2274.appspot.com/o/profiles%2Fdefault%2Fprofile.png?alt=media&token=532d39ab-45ee-4b8e-93c0-311bedccfc3a',
            }) :
            new Model({
                name: name,
                email: email,
                password: hashPassword,
                addressList: [],
                imageUrl: 'https://firebasestorage.googleapis.com/v0/b/flutter-shop-f2274.appspot.com/o/profiles%2Fdefault%2Fprofile.png?alt=media&token=532d39ab-45ee-4b8e-93c0-311bedccfc3a',
            })
        const result = await user.save();
        welocme.sendWelcomeMail(name, email, type);

        //Generate Token
        const token = jwt.sign(
            {
                email: email, //data
                id: user._id.toString()
            },
            process.env.JWT_KEY, // secret-string
        );

        res.status(201).json({
            message: 'User created Successfully!',
            data: result,
            token: token,
        })
    } catch (error) {
        return error500(error);
    }
}

//Check Sign-in
exports.signIn = async (req, res, next) => {
    const type = req.body.type;
    const Model = type == 'user' ? User : Admin;
    const email = req.body.email;
    const password = req.body.password;

    try {
        //Get user
        const user = await Model.findOne({ email: email });
        if (!user) {
            return next(error500('No user with the  email found', 401));
        }

        //Check password
        const hasMatched = await bcrypt.compare(password, user.password);
        if (!hasMatched) {
            return next(error500('Password is incorrect', 401));

        }

        //Generate Token
        const token = jwt.sign(
            {
                email: email, //data
                id: user._id.toString()
            },
            process.env.JWT_KEY, // secret-string
        );

        //Send Response
        res.status(200).json({
            token: token,
            data: user
        })

    } catch (error) {
        return error500(error);
    }
}

//To check is user is authenticated
exports.isAuth = async (req, res, next) => {
    const token = req.get('Authorization');
    const type = req.params.type;
    if (!token) { //if req header doesn't contain jwt
        console.log('error authorize');
        return next(error500('Not Authorized', 401));

    }

    // token = authHeader.split(' ')[1];  //extracting token from header



    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_KEY); //decode and verify token; returns decoded token

        if (!decodedToken) {  // the token didn't matched, thus decodedToken was undefined
            return next(error500('Not Authenticated', 401));
        }

    } catch (error) {
        return error500(error, 401);
    }
    const user = type == 'user' ? await User.findById(decodedToken.id) : await Admin.findById(decodedToken.id);
    if (!user) {
        console.log('error authorize');
        return next(error500('Not Authorized', 401));

    }
    req.userId = decodedToken.id;  //saving token to request,that can be used by next middlewares
    req.email = decodedToken.email;  //saving token to request,that can be used by next middlewares
    return next();

}

//to generate otp for resetting password
exports.resetPassword = async (req, res, next) => {
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    const email = req.body.email;

    const type = req.body.type;
    const Model = type == 'user' ? User : Admin;
    try {
        let user = await Model.findOne({ email: email });
        if (!user) {
            return next(error500('No user with the  email found', 401));
        }

        user.otp = otp;
        user.save().then((updatedUSer) => {
            reset.sendResetEmail(updatedUSer.name, updatedUSer.email, updatedUSer.otp);
            res.status(200).json({
                email: email
            });
        }).catch((err) => {
            error500(err, 401);
        });
    }
    catch {
        (err) => { error500(err, 401); }
    }


}

//to Reset the password
exports.checkReset = async (req, res, next) => {
    const type = req.body.type;
    const Model = type == 'user' ? User : Admin;
    const email = req.body.email;
    const password = req.body.password;
    const otp = req.body.otp;
    try {
        let user = await Model.findOne({ email: email });
        if (!user) {
            return next(error500('No user with the  email found', 401));
        }
        if (req.body.otp === user.otp) {
            user.otp = null;
            const hashPassword = await bcrypt.hash(password, 12);
            user.password = hashPassword;
            await user.save();
            return res.status(200).json({
                userId: user._id.toString()
            })
        }

        return next(error500('OTP didn\'t matched', 401));
    }
    catch {
        (err) => {
            error500(err, 500);
        }
    }
}













const error500 = (err, status) => {
    const error = new Error();
    error.message = err;
    error.statusCode = error.statusCode || status;
    return error;
}