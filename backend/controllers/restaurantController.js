const asyncHandler = require('express-async-handler');
const Restaurant = require('../models/restaurant');

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = asyncHandler(async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.json({ success: true, count: restaurants.length, data: restaurants });
});

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurant = asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
        res.status(404);
        throw new Error('Restaurant not found');
    }

    res.json({ success: true, data: restaurant });
});

// @desc    Create new restaurant
// @route   POST /api/restaurants
// @access  Private (Restaurant Owner / Admin)
const createRestaurant = asyncHandler(async (req, res) => {
    req.body.owner = req.user.id;

    const restaurant = await Restaurant.create(req.body);

    res.status(201).json({ success: true, data: restaurant });
});

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private (Owner / Admin)
const updateRestaurant = asyncHandler(async (req, res) => {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
        res.status(404);
        throw new Error('Restaurant not found');
    }

    // Make sure user is owner
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error(`User ${req.user.id} is not authorized to update this restaurant`);
    }

    restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.json({ success: true, data: restaurant });
});

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private (Owner / Admin)
const deleteRestaurant = asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
        res.status(404);
        throw new Error('Restaurant not found');
    }

    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error(`User ${req.user.id} is not authorized to delete this restaurant`);
    }

    await restaurant.deleteOne();

    res.json({ success: true, data: {} });
});

module.exports = {
    getRestaurants,
    getRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
};