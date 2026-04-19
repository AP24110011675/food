const express = require('express');
const router = express.Router();
const {
    getUsers,
    deleteUser,
    getDashboardStats,
    getAdminOrders,
    deleteOrder,
    updateAdminOrderStatus,
    seedAdminOrders
} = require('../controllers/adminController');

const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(admin);

router.get('/dashboard', getDashboardStats);
router.post('/seed-orders', seedAdminOrders);


router.route('/users')
    .get(getUsers);

router.route('/users/:id')
    .delete(deleteUser);

router.route('/orders')
    .get(getAdminOrders);

router.route('/order/:id')
    .put(updateAdminOrderStatus)
    .delete(deleteOrder);

module.exports = router;
