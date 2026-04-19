require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./backend/models/user');
const Restaurant = require('./backend/models/restaurant');
const MenuItem = require('./backend/models/menuItems');
const Order = require('./backend/models/order');

async function seedOrders() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB...');

    // Get a user
    const user = await User.findOne({ email: 'admin@foodhub.com' });
    if (!user) {
        console.log('No user found. Run create_admin.js first.');
        process.exit(1);
    }

    // Get some menu items (assuming they exist from seed_menu.js)
    const items = await MenuItem.find().limit(2);
    if (items.length === 0) {
        console.log('No menu items found. Seed menu first.');
        process.exit(1);
    }

    // Clear existing orders
    await Order.deleteMany({});
    console.log('Cleared existing orders.');

    const orders = [
        {
            userId: user._id,
            items: items.map(item => ({
                name: item.name,
                qty: 1,
                image: item.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
                price: item.price,
                product: item._id
            })),
            shippingAddress: {
                address: '123 Test St',
                city: 'Test City',
                postalCode: '123456',
                country: 'India'
            },
            paymentMethod: 'UPI',
            totalAmount: items.reduce((acc, item) => acc + item.price, 0),
            status: 'Pending'
        },
        {
            userId: user._id,
            items: [
                {
                    name: items[0].name,
                    qty: 2,
                    image: items[0].image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
                    price: items[0].price,
                    product: items[0]._id
                }
            ],
            shippingAddress: {
                address: '456 Sample Ave',
                city: 'Sample Town',
                postalCode: '654321',
                country: 'India'
            },
            paymentMethod: 'COD',
            totalAmount: items[0].price * 2,
            status: 'Preparing'
        }
    ];

    await Order.insertMany(orders);
    console.log('✅ Orders seeded successfully!');

    await mongoose.disconnect();
}

seedOrders().catch(err => {
    console.error(err);
    process.exit(1);
});
