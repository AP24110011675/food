const express = require('express');
const router = express.Router();
const {
    getMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
} = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');
const { restaurantOwner } = require('../middleware/roleMiddleware');

router.route('/:restaurantId')
    .get(getMenu)
    .post(protect, restaurantOwner, addMenuItem);

router.route('/item/:id')
    .put(protect, restaurantOwner, updateMenuItem)
    .delete(protect, restaurantOwner, deleteMenuItem);

module.exports = router;
