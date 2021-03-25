const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const usersRoutes = require('./routes/users-routes');
const chirpsRoutes = require('./routes/chirps-routes');
const HttpError = require('./models/http-error');
const cors = require('cors');

const app = express();

const connectUrl = 'mongodb+srv://our-first-user:leavebudget@cluster0.0xojg.mongodb.net/chirp?retryWrites=true&w=majority';

const connectConfig = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //used to parse req.body

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//Add user to session
passport.serializeUser(User.serializeUser());
//Remove user from session
passport.deserializeUser(User.deserializeUser());

// middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user; //passport user
    res.setHeader('Access-Control-Allow-Origin', '*'); //set header on resposne
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content-Type, Accept, Authorization'); //incoming requests handle
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
})

app.use('/auth', usersRoutes)
app.use('/chirps', chirpsRoutes)

app.use((req, res, next) => { //error handling for invalid routes
    const error = new HttpError('Could not find this route.', 404);
    return next(error);
})


app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.send({ message: error.message || 'An unknown error occurred!' });
})

mongoose
    .connect(connectUrl, connectConfig)
    .then(() => {
        console.log('+++ Database connected! +++');
        app.listen(5000)
    })
    .catch(err => {
        console.log(err);
    });
