const Admin = require('../models/admin');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/mail_sender');


// Middleware to attach admin_id (mongodb) with req
exports.authMiddleware = async (req, res, next) => {
    try {
        const authorizationHeaderToken = req.headers.authorization || req.cookies.token;

        if (!authorizationHeaderToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = authorizationHeaderToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const admin = await Admin.findOne({ email: decoded.email }).select('-password');

        if (!admin) {
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

// Controller for admin login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ message: 'Admin email does not exist' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        res.status(200).send({
            msg: 'Admin logged in',
            admin: {
                admin_id: admin._id,
                email: email,
                name: admin.name,
                token: token,
                expires_in: new Date(Date.now() + 60 * 60 * 1000),
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Controller for admin signup
exports.signup = async (req, res) => {
    try {
        const { name, email, phone_number, password } = req.body;
        const preAdmin = await Admin.findOne({ $or: [{ email }, { phone_number }] });

        if (preAdmin) {
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

// Controller for verifying and saving admin details
exports.verifySave = async (req, res) => {
    try {
        const token = req.query.token;
        const name = req.query.name;
        const email = req.query.email;
        const password = jwt.verify(token, process.env.JWT_SECRET);

        if (password) {
            bcrypt.hash(password.password, 12, async function (err, hash) {
                const adminDetail = { email: email, password: hash, name: name };
                const newAdmin = new Admin(adminDetail);
                const savedAdmin = await newAdmin.save();
                console.log(savedAdmin);
                res.send({ message: 'Email has been verified. Go to the website and login through email & password' });
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Controller for resetting admin password
exports.resetPassword = async (req, res) => {
    try {
        const { newPassword, password } = req.body;
        const email = req.email;

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ message: 'Admin email does not exist' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        bcrypt.hash(newPassword, 12, async function (err, hash) {
            const updated = await Admin.updateOne({ email }, { password: hash });
            console.log(updated);
            res.status(200).send({ message: 'Password has been changed. Go to the Login page and login through email & password' });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Controller for resetting admin name
exports.resetName = async (req, res) => {
    try {
        const { newName } = req.body;
        const email = req.email;
        const updated = await Admin.updateOne({ email }, { name: newName });

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

// Controller for deleting a user
exports.deleteUser = async (req, res) => {
    try {
        const { userEmail } = req.body;
        await User.deleteOne({ email: userEmail });
        res.status(200).send({ message: 'Account has been deleted successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Controller for deleting an admin
exports.deleteAdmin = async (req, res) => {
    try {
        await Admin.deleteOne({ email: req.email });
        res.status(200).send({ message: 'Account has been deleted successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
