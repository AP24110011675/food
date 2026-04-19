const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'MenuItem',
                required: true
            }
        }
    ],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['UPI', 'PhonePe', 'GPay', 'COD', 'PayPal'],
        default: 'UPI'
    },
    // UPI payment fields
    upiTransactionId: {
        type: String,
        default: null
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Payment Pending Confirmation', 'Paid', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    totalAmount: {
        type: Number,
        required: true,
        default: 0.0
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Deleted', 'Preparing', 'Delivered'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
