const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const usersRoutes = require('./routes/users-routes');
const chirpsRoutes = require('./routes/chirps-routes');
const allUsersRoutes = require('./routes/allUsers-routes');
const singleRoutes = require('./routes/single-routes');
const HttpError = require('./models/http-error');
const MongoDBStore = require('connect-mongo')(session);
const path = require("path")
const cors = require('cors');
const morgan = require('morgan')
require('dotenv').config()

const app = express();

const connectUrl = process.env.DB_URL

const connectDB = async () => {
	try {
		await mongoose.connect(connectUrl, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		});

		console.log('MongoDB Connected...');
	} catch (err) {
		console.error(err.message);
		// Exit process with failure
        console.log(err)
		process.exit(1);
	}
};

connectDB();


app.use(morgan('dev'))
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //used to parse req.body
app.use(express.static(path.join(__dirname, "client", "build")))



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

app.use('/auth', usersRoutes)
app.use('/chirps', chirpsRoutes)
app.use('/users', allUsersRoutes)
app.use('/:uid', singleRoutes)


// app.use((req, res, next) => { //error handling for invalid routes
//     const error = new HttpError('Could not find this route.', 404);
//     return next(error);
// })

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.send({ message: error.message || 'An unknown error occurred!' });
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})