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


router.post('/add/img', upload.single('image'),
    userController.authMiddleware,
    imagesController.addProfileImage
);

// router.post('/update/img', upload.single('image'),
//     userController.authMiddleware,
//     imagesController.updateProfileImage
// );


router.get('/img/:_id',
    imagesController.preview
);


module.exports = router;