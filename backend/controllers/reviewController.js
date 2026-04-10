const asyncHandler = require('express-async-handler');
const Review = require('../models/review');
const Restaurant = require('../models/restaurant');

// @desc    Get reviews for a restaurant
// @route   GET /api/reviews/:restaurantId
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ restaurant: req.params.restaurantId }).populate('user', 'name');
    res.json({ success: true, count: reviews.length, data: reviews });
});

// @desc    Add a review
// @route   POST /api/reviews/:restaurantId
// @access  Private
const addReview = asyncHandler(async (req, res) => {
    req.body.restaurant = req.params.restaurantId;
    req.body.user = req.user.id;

    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
        res.status(404);
        throw new Error('Restaurant not found');
    }

    const review = await Review.create(req.body);

    res.status(201).json({ success: true, data: review });
});

module.exports = {
    getReviews,
    addReview
};
