const asyncHandler = require('express-async-handler');
const MenuItem = require('../models/menuItems');
const Restaurant = require('../models/restaurant');

// @desc    Get menu for a restaurant
// @route   GET /api/menu/:restaurantId
// @access  Public
const getMenu = asyncHandler(async (req, res) => {
    const menuItems = await MenuItem.find({ restaurantId: req.params.restaurantId });
    res.json({ success: true, count: menuItems.length, data: menuItems });
});

// @desc    Add menu item
// @route   POST /api/menu/:restaurantId
// @access  Private (Owner / Admin)
const addMenuItem = asyncHandler(async (req, res) => {
    req.body.restaurantId = req.params.restaurantId;

    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
        res.status(404);
        throw new Error('Restaurant not found');
    }

    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to add menu items to this restaurant');
    }

    const menuItem = await MenuItem.create(req.body);

    res.status(201).json({ success: true, data: menuItem });
});

// @desc    Update menu item
// @route   PUT /api/menu/item/:id
// @access  Private (Owner / Admin)
const updateMenuItem = asyncHandler(async (req, res) => {
    let menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
        res.status(404);
        throw new Error('Menu item not found');
    }

    const restaurant = await Restaurant.findById(menuItem.restaurantId);

    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to update this menu item');
    }

    menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.json({ success: true, data: menuItem });
});

// @desc    Delete menu item
// @route   DELETE /api/menu/item/:id
// @access  Private (Owner / Admin)
const deleteMenuItem = asyncHandler(async (req, res) => {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
        res.status(404);
        throw new Error('Menu item not found');
    }

    const restaurant = await Restaurant.findById(menuItem.restaurantId);

    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to delete this menu item');
    }

    await menuItem.deleteOne();

    res.json({ success: true, data: {} });
});

module.exports = {
    getMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
};
