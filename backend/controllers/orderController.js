const asyncHandler = require('express-async-handler');
const Order = require('../models/order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod: paymentMethod || 'UPI',
        paymentStatus: 'Pending',
        totalPrice,
        status: 'Placed'
    });

    const createdOrder = await order.save();
    res.status(201).json({ success: true, data: createdOrder });
});

// @desc    Mark order as "Payment Pending Confirmation" (user clicked "I have paid")
// @route   PUT /api/orders/:id/pay
// @access  Private
const markPaymentPending = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Ensure the order belongs to this user
    if (order.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized');
    }

    order.paymentStatus = 'Payment Pending Confirmation';
    order.status = 'Payment Pending Confirmation';
    order.upiTransactionId = req.body.upiTransactionId || null;

    const updatedOrder = await order.save();
    res.json({ success: true, data: updatedOrder });
});

// @desc    Approve payment & move to "Confirmed/Preparing" (restaurant owner / admin)
// @route   PUT /api/orders/:id/approve-payment
// @access  Private (Owner / Admin)
const approvePayment = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentStatus = 'Paid';
    order.status = req.body.status || 'Preparing';

    const updatedOrder = await order.save();
    res.json({ success: true, data: updatedOrder });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.json({ success: true, data: order });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Owner / Admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = req.body.status || order.status;
        if (req.body.status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.json({ success: true, data: updatedOrder });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
});

// @desc    Get all orders (admin/restaurant owner dashboard)
// @route   GET /api/orders
// @access  Private (Admin)
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
});

module.exports = {
    addOrderItems,
    markPaymentPending,
    approvePayment,
    getOrderById,
    updateOrderStatus,
    getMyOrders,
    getAllOrders
};
