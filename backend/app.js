const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const usersRoutes = require('./routes/users-routes');
const chirpsRoutes = require('./routes/chirps-routes');
const allUsersRoutes = require('./routes/allUsers-routes');
const singleRoutes = require('./routes/single-routes');
const HttpError = require('./models/http-error');
const MongoDBStore = require('connect-mongo')(session);
const cors = require('cors');
const morgan = require('morgan')
require('dotenv').config()

const app = express();

const connectUrl = 'mongodb+srv://our-first-user:leavebudget@cluster0.0xojg.mongodb.net/chirp?retryWrites=true&w=majority'

mongoose.connect(connectUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

mongoose.connection.on('error', (err) => {
    console.error(`🚫 → ${err.message}`);
  });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


// const connectConfig = {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false
// }

app.use(morgan('dev'))
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //used to parse req.body



const secret = process.env.SECRET || 'thishouldbeabettersecret!';

const store = new MongoDBStore({
    url: connectUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//Add user to session
passport.serializeUser(User.serializeUser());
//Remove user from session
passport.deserializeUser(User.deserializeUser());

// middleware
app.use((req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', '*'); //set header on resposne
    // res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content-Type, Accept, Authorization'); //incoming requests handle
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
})


app.use('/auth', usersRoutes)
app.use('/chirps', chirpsRoutes)
app.use('/users', allUsersRoutes)
app.use('/:uid', singleRoutes)


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

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})