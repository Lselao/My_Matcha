const express = require('express');

const router = express.Router();
const matchController = require('../controllers/match');

router.get('/match/:userId', matchController.getMatches);
router.get('/getUser/:id', matchController.getUser);
router.post('/search', matchController.searchUsers);

// router.get('/products/:productId', shopController.showProduct);

module.exports = router;
