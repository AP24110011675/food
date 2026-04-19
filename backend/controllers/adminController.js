const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Order = require('../models/order');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json({ success: true, count: users.length, data: users });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ success: true, data: {} });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments({});
    const totalOrders = await Order.countDocuments({});
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    
    // Calculate total revenue
    const revenueAgg = await Order.aggregate([
        { $match: { status: { $ne: 'Deleted' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    res.json({
        success: true,
        data: {
            totalOrders,
            totalRevenue,
            totalUsers,
            pendingOrders
        }
    });
});

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAdminOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('userId', 'id name email').sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
});

// @desc    Delete order
// @route   DELETE /api/admin/order/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (order) {
        res.json({ success: true, message: 'Order deleted' });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order status
// @route   PUT /api/admin/order/:id
// @access  Private/Admin
const updateAdminOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!status) {
        res.status(400);
        throw new Error('Please provide a status');
    }

    const validStatuses = ['Pending', 'Confirmed', 'Deleted', 'Preparing', 'Delivered'];
    if (!validStatuses.includes(status)) {
        res.status(400);
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (order) {
        res.json({ success: true, data: order });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Seed sample orders
// @route   POST /api/admin/seed-orders
// @access  Private/Admin
const seedAdminOrders = asyncHandler(async (req, res) => {
    const MenuItem = require('../models/menuItems');
    const items = await MenuItem.find().limit(5);
    
    if (items.length === 0) {
        res.status(400);
        throw new Error('Seed menu items first');
    }

    const orders = [
        {
            userId: req.user._id,
            items: items.map(i => ({
                name: i.name,
                qty: 1,
                image: i.image,
                price: i.price,
                product: i._id
            })),
            shippingAddress: { address: 'Admin Street', city: 'Admin City', postalCode: '101010', country: 'India' },
            paymentMethod: 'UPI',
            totalAmount: items.reduce((acc, i) => acc + i.price, 0),
            status: 'Pending'
        }
    ];

    await Order.insertMany(orders);
    res.json({ success: true, message: 'Sample orders seeded' });
});

module.exports = {
    getUsers,
    deleteUser,
    getDashboardStats,
    getAdminOrders,
    deleteOrder,
    updateAdminOrderStatus,
    seedAdminOrders
};

