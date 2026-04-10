const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

const restaurantOwner = (req, res, next) => {
    if (req.user && (req.user.role === 'restaurant_owner' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as a restaurant owner');
    }
};

module.exports = { admin, restaurantOwner };