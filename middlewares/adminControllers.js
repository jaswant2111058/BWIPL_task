const admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/mail_sender');

// Middleware to attach team_id (mongodb) with req
exports.authMiddleware = async (req, res, next) => {
    try {
        const authorizationHeaderToken = req.headers.authorization||req.cookies.token;
        
        if (!authorizationHeaderToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = authorizationHeaderToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const admin = await admin.findOne({ email: decoded.email }).select('-password');
        
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

        const admin = await admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ message: 'admin email does not exist' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).send({
            msg: 'admin logged in',
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
        const preadmin = await admin.findOne({ $or: [{ email }, { phone_number }] });

        if (preadmin) {
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
                const newadmin = new admin(adminDetail);
                const savedadmin = await newadmin.save();
                console.log(savedadmin);
                res.send({ message: 'Email has been verified. Go to the website and login through email & password' });
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};



