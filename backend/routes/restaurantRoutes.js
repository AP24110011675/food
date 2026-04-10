const express = require('express');
const router = express.Router();
const {
    getRestaurants,
    getRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
} = require('../controllers/restaurantController');
const { protect } = require('../middleware/authMiddleware');
const { restaurantOwner } = require('../middleware/roleMiddleware');

router.route('/')
    .get(getRestaurants)
    .post(protect, restaurantOwner, createRestaurant);

router.route('/:id')
    .get(getRestaurant)
    .put(protect, restaurantOwner, updateRestaurant)
    .delete(protect, restaurantOwner, deleteRestaurant);

module.exports = router;
