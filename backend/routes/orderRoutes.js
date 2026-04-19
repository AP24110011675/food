const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    markPaymentPending,
    approvePayment,
    getOrderById,
    updateOrderStatus,
    getMyOrders,
    getAllOrders
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { restaurantOwner } = require('../middleware/roleMiddleware');

router.route('/')
    .post(protect, addOrderItems)
    .get(protect, getMyOrders);

router.route('/myorders')
    .get(protect, getMyOrders);

router.route('/:id')
    .get(protect, getOrderById);

// User marks "I have paid"
router.route('/:id/pay')
    .put(protect, markPaymentPending);

// Admin/Owner approves payment
router.route('/:id/approve-payment')
    .put(protect, restaurantOwner, approvePayment);

// General status update (admin)
router.route('/:id/status')
    .put(protect, restaurantOwner, updateOrderStatus);

module.exports = router;
