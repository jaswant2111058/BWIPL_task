const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require("../middlewares/userContollers")


router.post('/signup',
[
  body('name').exists().withMessage('Name is required'),
  body('password').exists().withMessage('Password is required'),
  body('email').exists().withMessage('Email is required'),
  body('phone_number').exists().withMessage('Phone number is required'),
],
  userController.signup
);




router.get('/email/verification',
userController.verifySave
);




router.post('/login',
  [
    body('email').exists().withMessage('email is required'),
    body('password').exists().withMessage('Password is required'),
  ],
 
  userController.login
);




router.post('/password/reset',
  [
    body("password").exists().withMessage("password is required"),
    body("newPassword").exists().withMessage("new password is required"),
  ],
  userController.authMiddleware,userController.resetPassword
);




router.post('/name/reset',
  [
    body("newName").exists().withMessage("email is required"),
    
  ],
  userController.authMiddleware,userController.resetName
);




router.post('/delete/user',
  [
    body("email").exists().withMessage("email is required"),
    body("password").exists().withMessage("New password is required"),
  ],
  userController.authMiddleware,userController.deleteAccount
);




module.exports = router;