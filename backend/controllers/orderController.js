const asyncHandler = require('express-async-handler');
const Order = require('../models/order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        items,
        shippingAddress,
        paymentMethod,
        totalAmount
    } = req.body;

    if (!items || items.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
        res.status(400);
        throw new Error('Please provide complete shipping address (address, city, postalCode, country)');
    }

    if (!totalAmount || totalAmount <= 0) {
        res.status(400);
        throw new Error('Please provide a valid totalAmount');
    }

    const order = new Order({
        items,
        userId: req.user._id,
        shippingAddress,
        paymentMethod: paymentMethod || 'UPI',
        totalAmount,
        status: 'Pending'
    });

    const createdOrder = await order.save();
    res.status(201).json({ success: true, data: createdOrder });
});

// @desc    Mark payment info (user side)
// @route   PUT /api/orders/:id/pay
// @access  Private
const markPaymentPending = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    if (order.userId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized');
    }

    order.upiTransactionId = req.body.upiTransactionId || null;
    order.status = 'Preparing'; // Move to Preparing automatically or keep as is? 
    // User requested enum: ["Pending", "Preparing", "Delivered"]. 
    // Let's keep it Pending until admin approves, or move to Preparing if auto-approve is desired.
    // The user said "Admin sees order" after place order.
    
    const updatedOrder = await order.save();
    res.json({ success: true, data: updatedOrder });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('userId', 'name email');

    if (order) {
        res.json({ success: true, data: order });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
});

// @desc    Get all orders (admin/restaurant owner dashboard)
// @route   GET /api/orders
// @access  Private (Admin)
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
});

// @desc    Approve Payment
// @route   PUT /api/orders/:id/approve-payment
// @access  Private/Owner
const approvePayment = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        const updatedOrder = await order.save();
        res.json({ success: true, data: updatedOrder });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update Order Status
// @route   PUT /api/orders/:id/status
// @access  Private/Owner
const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.status = req.body.status || order.status;
        const updatedOrder = await order.save();
        res.json({ success: true, data: updatedOrder });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

module.exports = {
    addOrderItems,
    markPaymentPending,
    getOrderById,
    getMyOrders,
    getAllOrders,
    approvePayment,
    updateOrderStatus
};
