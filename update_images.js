const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Restaurant = require('./backend/models/restaurant');
const MenuItem = require('./backend/models/menuItems');

dotenv.config();

const FOOD_IMAGES = {
    'Burger': 'https://res.cloudinary.com/dscufms3x/image/upload/v1/food_hub/burger.jpg',
    'Pizza': 'https://res.cloudinary.com/dscufms3x/image/upload/v1/food_hub/pizza.jpg',
    'Sushi': 'https://res.cloudinary.com/dscufms3x/image/upload/v1/food_hub/sushi.jpg',
    'Fries': 'https://res.cloudinary.com/dscufms3x/image/upload/v1/food_hub/fries.jpg',
    'Salad': 'https://res.cloudinary.com/dscufms3x/image/upload/v1/food_hub/salad.jpg',
    'Pasta': 'https://res.cloudinary.com/dscufms3x/image/upload/v1/food_hub/pasta.jpg',
    'Coffee': 'https://res.cloudinary.com/dscufms3x/image/upload/v1/food_hub/coffee.jpg',
    'Dessert': 'https://res.cloudinary.com/dscufms3x/image/upload/v1/food_hub/dessert.jpg',
    'Default': 'https://res.cloudinary.com/dscufms3x/image/upload/v1/food_hub/default.jpg',
    'Biryani': 'https://res.cloudinary.com/dscufms3x/image/upload/v1/food_hub/biryani.jpg'
};

const updateImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB Connected');

        // Update Restaurants
        const restaurants = await Restaurant.find({});
        for (const res of restaurants) {
            let imageUrl = FOOD_IMAGES['Default'];
            const nameLower = res.name.toLowerCase();
            if (nameLower.includes('burger')) imageUrl = FOOD_IMAGES['Burger'];
            else if (nameLower.includes('pizza')) imageUrl = FOOD_IMAGES['Pizza'];
            else if (nameLower.includes('sushi')) imageUrl = FOOD_IMAGES['Sushi'];
            else if (nameLower.includes('biryani')) imageUrl = FOOD_IMAGES['Biryani'];
            
            res.image = imageUrl;
            await res.save();
            console.log(`Updated restaurant: ${res.name}`);
        }

        // Update MenuItems
        const items = await MenuItem.find({});
        for (const item of items) {
            let imageUrl = FOOD_IMAGES['Default'];
            const nameLower = item.name.toLowerCase();
            const descLower = item.description.toLowerCase();
            
            if (nameLower.includes('burger')) imageUrl = FOOD_IMAGES['Burger'];
            else if (nameLower.includes('pizza')) imageUrl = FOOD_IMAGES['Pizza'];
            else if (nameLower.includes('fries')) imageUrl = FOOD_IMAGES['Fries'];
            else if (nameLower.includes('salad')) imageUrl = FOOD_IMAGES['Salad'];
            else if (nameLower.includes('pasta')) imageUrl = FOOD_IMAGES['Pasta'];
            else if (nameLower.includes('coffee')) imageUrl = FOOD_IMAGES['Coffee'];
            else if (nameLower.includes('dessert') || nameLower.includes('cake')) imageUrl = FOOD_IMAGES['Dessert'];
            else if (nameLower.includes('biryani')) imageUrl = FOOD_IMAGES['Biryani'];
            
            item.image = imageUrl;
            await item.save();
            console.log(`Updated menu item: ${item.name}`);
        }

        console.log('All images updated securely to Cloudinary paths');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateImages();
