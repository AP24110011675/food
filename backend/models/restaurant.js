const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a restaurant name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5'],
        default: 4.0
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);