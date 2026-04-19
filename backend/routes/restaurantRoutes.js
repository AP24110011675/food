const express = require('express');
const router = express.Router();
const {
    getRestaurants,
    getRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
} = require('../controllers/restaurantController');
const { protect } = require('../middleware/authMiddleware');
const { restaurantOwner } = require('../middleware/roleMiddleware');

const { upload } = require('../utils/cloudinary');

router.route('/')
    .get(getRestaurants)
    .post(protect, restaurantOwner, createRestaurant);

router.post('/upload', protect, restaurantOwner, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    res.json({ success: true, url: req.file.path });
});

router.route('/:id')
    .get(getRestaurant)
    .put(protect, restaurantOwner, updateRestaurant)
    .delete(protect, restaurantOwner, deleteRestaurant);

module.exports = router;
