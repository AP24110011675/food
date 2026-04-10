const express = require('express');
const router = express.Router();
const {
    getReviews,
    addReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:restaurantId')
    .get(getReviews)
    .post(protect, addReview);

module.exports = router;
