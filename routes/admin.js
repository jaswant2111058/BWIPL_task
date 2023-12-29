const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminControllers = require('../middlewares/adminControllers');

// Route for user registration
router.post(
  '/register',
  [
    body('name').exists().withMessage('Name is required'),
    body('password').exists().withMessage('Password is required'),
    body('email').exists().withMessage('Email is required'),
    body('phone_number').exists().withMessage('Phone number is required'),
  ],
  adminControllers.register
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

// Route for sending OTP for password reset
router.post('/password/reset',
[body('email').exists().withMessage('Email is required')], 
adminControllers.sendRestmail);

// Route for resetting password
router.post(
  '/password/reset/verify',
  [
    body('email').exists().withMessage('Email is required'),
    body('password').exists().withMessage('New password is required'),
  ],
  adminControllers.authMiddleware,
  adminControllers.resetPassword
);

// Route for resetting user name
router.post('/name/reset', [body('rename').exists().withMessage('New name is required')],
 adminControllers.resetName
 );

// Route for adding a profile image
router.post(
  '/profile_image/add',
  [
    body('email').exists().withMessage('Email is required'),
    body('password').exists().withMessage('Password is required'),
  ],
  adminControllers.authMiddleware,
  adminControllers.addProfileImage
);

// Route for resetting a profile image
router.post(
  '/profile_image/reset',
  [
    body('email').exists().withMessage('Email is required'),
    body('password').exists().withMessage('Password is required'),
  ],
  adminControllers.authMiddleware,
  adminControllers.resetProfileImage
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
