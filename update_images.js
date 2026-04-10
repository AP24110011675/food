const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Restaurant = require('./backend/models/restaurant');
const MenuItem = require('./backend/models/menuItems');

dotenv.config();

const FOOD_IMAGES = {
    'Burger': 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Sushi': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Fries': 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Pasta': 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Dessert': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Default': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
};

const updateImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB Connected');

        // Update Restaurants
        const restaurants = await Restaurant.find({});
        for (const res of restaurants) {
            if (res.image === 'no-photo.jpg' || !res.image) {
                let imageUrl = FOOD_IMAGES['Default'];
                if (res.name.toLowerCase().includes('burger')) imageUrl = FOOD_IMAGES['Burger'];
                else if (res.name.toLowerCase().includes('pizza')) imageUrl = FOOD_IMAGES['Pizza'];
                else if (res.name.toLowerCase().includes('sushi')) imageUrl = FOOD_IMAGES['Sushi'];
                
                res.image = imageUrl;
                await res.save();
                console.log(`Updated restaurant: ${res.name}`);
            }
        }

        // Update MenuItems
        const items = await MenuItem.find({});
        for (const item of items) {
            if (item.image === 'no-photo.jpg' || !item.image) {
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
                
                item.image = imageUrl;
                await item.save();
                console.log(`Updated menu item: ${item.name}`);
            }
        }

        console.log('All images updated successfully');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateImages();
