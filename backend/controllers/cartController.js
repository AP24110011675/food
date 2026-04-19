const asyncHandler = require('express-async-handler');
const Cart = require('../models/cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
        cart = await Cart.create({ user: req.user._id, cartItems: [] });
    }
    
    res.json({ success: true, data: cart });
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
    const { name, qty, image, price, product } = req.body;

    if (!name || !qty || !price || !product) {
        res.status(400);
        throw new Error('Please provide name, qty, price, and product');
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            cartItems: [{ name, qty, image: image || 'no-photo.jpg', price, product }]
        });
    } else {
        // Check if item already exists in cart
        const existingItemIndex = cart.cartItems.findIndex(
            item => item.product.toString() === product
        );

        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cart.cartItems[existingItemIndex].qty += qty;
        } else {
            // Add new item
            cart.cartItems.push({ name, qty, image: image || 'no-photo.jpg', price, product });
        }
        await cart.save();
    }

    res.status(201).json({ success: true, data: cart });
});

// @desc    Update/Sync cart
// @route   POST /api/cart
// @access  Private
const updateCart = asyncHandler(async (req, res) => {
    const { cartItems } = req.body;
    
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (cart) {
        cart.cartItems = cartItems;
        await cart.save();
    } else {
        cart = await Cart.create({ user: req.user._id, cartItems });
    }
    
    res.json({ success: true, data: cart });
});

// @desc    Remove single item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    cart.cartItems = cart.cartItems.filter(
        item => item.product.toString() !== req.params.id && item._id.toString() !== req.params.id
    );
    await cart.save();

    res.json({ success: true, data: cart });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (cart) {
        cart.cartItems = [];
        await cart.save();
    }
    
    res.json({ success: true, data: {} });
});

module.exports = {
    getCart,
    addToCart,
    updateCart,
    removeCartItem,
    clearCart
};
