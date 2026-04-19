const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCart, removeCartItem, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getCart)
    .post(updateCart)
    .delete(clearCart);

router.post('/add', addToCart);
router.delete('/:id', removeCartItem);

module.exports = router;
