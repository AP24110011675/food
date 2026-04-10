const express = require('express');
const router = express.Router();
const {
    getUsers,
    deleteUser
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(admin);

router.route('/users')
    .get(getUsers);

router.route('/users/:id')
    .delete(deleteUser);

module.exports = router;
