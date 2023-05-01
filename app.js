const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');

const app = express();

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.cwp7tik.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`

app.use(bodyParser.json()); //parse json body

app.use(authRoutes);
app.use(userRoutes);
app.use(productRoutes);

//for handling errors
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const data = error.message;
    res.status(status).json({ message: data, status: error.statusCode })
})


mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('connected to mongoDB');
        app.listen(3000);
    })
    .catch((e) => console.log('Falied to connect to mongoDB \n ' + e)
    )
