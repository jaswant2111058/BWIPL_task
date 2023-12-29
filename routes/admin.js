const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');


router.post('/register',
  [
    body('name').exists().withMessage('name is required'),
    body('password').exists().withMessage('Password is required'),
    body('email').exists().withMessage('email is required'),
    body('phone_number').exists().withMessage('phone number is required'),
   ], 
  userController.register
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
    body("email").exists().withMessage("email is required"),
  ],
  userController.sendOtp
);





router.post('/password/reset/verify',
  [
    body("email").exists().withMessage("email is required"),
    body("password").exists().withMessage("New password is required"),
  ],
  userController.resetPassword
);





router.post('/name/reset',
  [
    body("rename").exists().withMessage("rename is required"),
   
  ],
  userController.resetPassword
);


router.post('/profile_image/add',
  [
    body("email").exists().withMessage("email is required"),
    body("password").exists().withMessage("New password is required"),
  ],
  userController.resetPassword
);





router.post('/profile_image/reset',
  [
    body("email").exists().withMessage("email is required"),
    body("password").exists().withMessage("New password is required"),
  ],
  userController.resetPassword
);




router.post('/delete/user',
  [
    body("email").exists().withMessage("email is required"),
    body("password").exists().withMessage("New password is required"),
  ],
  userController.resetPassword
);




router.post('/delete/admin',
  [
    body("email").exists().withMessage("email is required"),
    body("password").exists().withMessage("New password is required"),
  ],
  userController.resetPassword
);




module.exports = router;