const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/mail_sender');

// Middleware to attach user_id (mongodb) with req
exports.authMiddleware = async (req, res, next) => {
    try {
        const authorizationHeaderToken = req.headers.authorization || req.cookies.token;

        if (!authorizationHeaderToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = authorizationHeaderToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ email: decoded.email }).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.email = decoded.email;
        next();

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token expired' });
        }

        console.log(typeof (error));
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Controller for user login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'User email does not exist' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });


        res.status(200).send({
            msg: 'User logged in',
            user: {
                user_id: user._id,
                email: email,
                name: user.name,
                token: token,
                expires_in: new Date(Date.now() + 60 * 60 * 1000),
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Controller for user signup
exports.signup = async (req, res) => {
    try {
        const { name, email, phone_number, password } = req.body;
        const preUser = await User.findOne({ $or: [{ email }, { phone_number }] });

        if (preUser) {
            res.send({ message: 'Email already exists' });
        } else {
            const token = jwt.sign({ password: password }, process.env.JWT_SECRET, {
                expiresIn: `${1000 * 60 * 5}`,
            });
            sendMail(name, email, token);
            res.status(200).send({ message: `Mail has been sent to the email ID ${email}` });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Controller for verifying and saving user details
exports.verifySave = async (req, res) => {
    try {
        const token = req.query.token;
        const name = req.query.name;
        const email = req.query.email;
        const password = jwt.verify(token, process.env.JWT_SECRET);

        if (password) {
            bcrypt.hash(password.password, 12, async function (err, hash) {
                const userDetail = { email: email, password: hash, name: name };
                const newUser = new User(userDetail);
                const savedUser = await newUser.save();
                console.log(savedUser);
                res.send({ message: 'Email has been verified. Go to the website and login through email & password' });
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Controller for resetting user password
exports.resetPassword = async (req, res) => {
    try {
        const { newPassword, password } = req.body;
        const email = req.email;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'User email does not exist' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        bcrypt.hash(newPassword, 12, async function (err, hash) {
            const updated = await User.updateOne({ email }, { password: hash });
            console.log(updated);
            res.status(200).send({ message: 'Password has been changed. Go to the Login page and login through email & password' });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Controller for resetting user name
exports.resetName = async (req, res) => {
    try {
        const { newName } = req.body;
        const email = req.email;
        const updated = await User.updateOne({ email }, { name: newName });

        if (updated) {
            res.status(200).send({ message: 'Name has been changed' });
        } else {
            res.status(400).send('Unknown Error: Update not successful');
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Controller for deleting user account
exports.deleteAccount = async (req, res) => {
    try {
        await User.deleteOne({ email: req.email });
        res.status(200).send({ message: 'Account has been deleted successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
