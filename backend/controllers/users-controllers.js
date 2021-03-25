const HttpError = require('../models/http-error');
const User = require('../models/user');

const register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        const fullUser = await User.findOne({ username: req.body.username })
        // const newUser = (req.body.username)
        res.send(fullUser);

    } catch (error) {
        return next(
            new HttpError('Registration failed, please try again.', 500)
        );
        console.log(error)
    }

}

const login = (req, res, next) => {
    console.log('logged in!')
}

const logout = () => {
    req.logout();
}

exports.register = register;
exports.login = login;
exports.logout = logout;