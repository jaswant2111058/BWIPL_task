const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminControllers = require('../middlewares/adminControllers');

// Route for user registration
router.post( '/signup',
  [
    body('name').exists().withMessage('Name is required'),
    body('password').exists().withMessage('Password is required'),
    body('email').exists().withMessage('Email is required'),
    body('phone_number').exists().withMessage('Phone number is required'),
  ],
adminControllers.signup
);

// Route for email verification
router.get('/email/verification',
 adminControllers.verifySave);

// Route for user login
router.post('/login',
  [
    body('email').exists().withMessage('Email is required'),
    body('password').exists().withMessage('Password is required'),
  ],
  adminControllers.login
);

// Route password reset
router.post('/password/reset',
[body('email').exists().withMessage('Email is required')], 
adminControllers.authMiddleware,
adminControllers.resetPassword);


// Route for resetting user name
router.post('/name/reset', 
[body('rename').exists().withMessage('New name is required')],
adminControllers.authMiddleware,adminControllers.resetName
 );



// Route for deleting a user
router.post(
  '/delete/user',
  [
    body('email').exists().withMessage('Email is required'),
    body('password').exists().withMessage('Password is required'),
  ],
  adminControllers.authMiddleware,
  adminControllers.deleteUser
);

// Route for deleting an admin
router.post(
  '/delete/admin',
  [
    body('email').exists().withMessage('Email is required'),
    body('password').exists().withMessage('Password is required'),
  ],
  adminControllers.authMiddleware,
  adminControllers.deleteAdmin
);

module.exports = router;
