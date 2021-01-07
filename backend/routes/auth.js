const express = require('express');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();
const authController = require('../controllers/auth');
const auth = require('../middleware/auth');

router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/signup', authController.postSignUp);

router.post('/reset', authController.postReset);
router.get('/whoami/:socketId', auth, authController.getUser);
router.post('/update',auth, authController.postDetails);
router.post('/imageUpload',auth, upload.single('image'), authController.postImageUpload);
router.post('/profilePicUpload', upload.single('image'), authController.postProfilePicUpload);
router.post('/imageDelete', auth, authController.deleteImage);

router.post('/updateLocation', authController.postLocations);


router.get('/locations', authController.getLocations);
router.get('/sameLocations', authController.getSameLocations);
router.get('/reset/:token', authController.getNewPassword);
router.post('/confirmPassword', authController.resetPasswordConfirm);
router.get('/checkToken/:token', authController.checkToken);
router.get('/confirm/:token', authController.getEmailConfirmation);
router.post('/new-password', authController.postNewPassword);
module.exports = router;
