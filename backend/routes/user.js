const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();
const userController = require('../controllers/user');

router.post('/likes',auth, userController.Like);
router.post('/dislike',auth, userController.Dislike);
router.get('/getConnection/:currentUserId/:visitedUserId', userController.getIsConnection);
router.get('/getConnections/:currentUserId', userController.getConnections);
router.get('/getLiked/:currentUserId/:visitedUserId', userController.getIsLiked);
router.get('/getNotifications/:currentUserId', userController.getNotifications);
router.post('/addInterests', auth, userController.addInterests);
router.post('/deleteInterest', auth, userController.deleteInterest);
router.post('/deleteInterest', auth, userController.deleteInterest);
router.delete('/deleteProfile/:userId',auth, userController.deleteUser);
router.put('/blockUser/:userId/:visitedUserId',auth, userController.blockUser);
router.get('/getIsBlocked/:currentUserId/:visitedUserId', userController.getIsBlocked);
router.get('/getIsReported/:currentUserId/:visitedUserId', userController.getIsReported);
router.put('/reportUser/:userId/:visitedUserId', auth, userController.reportUser);
router.get('/getLocations', userController.getLocations);
router.post('/updateUserLocation', auth, userController.updateLocation);

module.exports = router;
