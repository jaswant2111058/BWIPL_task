const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const imagesController = require('../controllers/imagesController')
const multer = require("multer");

const  storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null,"uploads");
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + "-" + Date.now());
	}
});
const upload = multer({storage : storage });



router.post('/user/addimg', upload.single('image'),
    userController.authMiddleware,
    imagesController.userAddProfileImage
);

router.post('/admin/addimg', upload.single('image'),
    userController.authMiddleware,
    imagesController.adminAddProfileImage
);


router.get('/img/:_id',
    imagesController.preview
);

module.exports = router;