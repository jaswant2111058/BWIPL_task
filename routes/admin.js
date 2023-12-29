const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const adminContollers = require("../middlewares/adminControllers")


router.post('/register',
  [
    body('name').exists().withMessage('name is required'),
    body('password').exists().withMessage('Password is required'),
    body('email').exists().withMessage('email is required'),
    body('phone_number').exists().withMessage('phone number is required'),
   ], 
  adminContollers.register
);


router.get('/email/verification',
adminContollers.verifySave
);


router.post('/login',
  [
    body('email').exists().withMessage('email is required'),
    body('password').exists().withMessage('Password is required'),
  ],
 
  adminContollers.login
);




router.post('/password/reset',
  [
    body("email").exists().withMessage("email is required"),
  ],
  adminContollers.sendOtp
);





router.post('/password/reset/verify',
  [
    body("email").exists().withMessage("email is required"),
    body("password").exists().withMessage("New password is required"),
  ],
  adminContollers.resetPassword
);





router.post('/name/reset',
  [
    body("rename").exists().withMessage("rename is required"),
   
  ],
  adminContollers.resetName
);


router.post('/profile_image/add',
  [
    body("email").exists().withMessage("email is required"),
    body("password").exists().withMessage("New password is required"),
  ],
  adminContollers.addProfileImage
);





router.post('/profile_image/reset',
  [
    body("email").exists().withMessage("email is required"),
    body("password").exists().withMessage("New password is required"),
  ],
  adminContollers.resetProfileImage
);




router.post('/delete/user',
  [
    body("email").exists().withMessage("email is required"),
    body("password").exists().withMessage("New password is required"),
  ],
  adminContollers.deleteUser
);




router.post('/delete/admin',
  [
    body("email").exists().withMessage("email is required"),
    body("password").exists().withMessage("New password is required"),
  ],
  adminContollers.deleteAdmin
);




module.exports = router;