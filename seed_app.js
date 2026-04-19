const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./backend/models/user');
const Restaurant = require('./backend/models/restaurant');
const MenuItem = require('./backend/models/menuItems');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Locally...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const CATEGORY_IMAGES = {
  'Biryani': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d',
  'Pizza': 'https://images.unsplash.com/photo-1594007654729-407eedc4be65',
  'Burger': 'https://images.unsplash.com/photo-1550547660-d9450f859349',
  'Indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
  'Chinese': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b',
  'Desserts': 'https://images.unsplash.com/photo-1551024601-bec78aea704b',
  'Beverages': 'https://images.unsplash.com/photo-1544145945-f904253d0c7e'
};

const SAMPLE_MENU_DATA = {
  'Biryani': [
    { name: 'Chicken Dum Biryani', price: 280, description: 'Slow-cooked aromatic basmati rice with succulent chicken and spices.' },
    { name: 'Mutton Keema Biryani', price: 350, description: 'Rich and flavorful biryani with minced mutton and roasted masalas.' },
    { name: 'Veg Paneer Biryani', price: 240, description: 'Fragrant rice with marinated paneer cubes and seasonal vegetables.' },
    { name: 'Egg Biryani Special', price: 220, description: 'Classic biryani topped with boiled eggs and fried onions.' },
    { name: 'Prawn Biryani', price: 420, description: 'Coastal style biryani with fresh prawns and coconut milk hints.' },
    { name: 'Ghee Roast Biryani', price: 300, description: 'Traditional biryani roasted in pure desi ghee for rich aroma.' }
  ],
  'Pizza': [
    { name: 'Classic Margherita', price: 249, description: 'Fresh tomato sauce, mozzarella cheese, and basil leaves.' },
    { name: 'Garden Farmhouse', price: 329, description: 'Loaded with capsicum, onion, mushroom, and fresh tomatoes.' },
    { name: 'Paneer Makhani Pizza', price: 389, description: 'Fusion pizza with paneer tikka and creamy makhani sauce.' },
    { name: 'Peppy Paneer', price: 349, description: 'Chunky paneer with crisp capsicum and spicy red pepper.' },
    { name: 'Cheese Burst Veg', price: 450, description: 'Extra cheesy pizza with liquid cheese inside the crust.' },
    { name: 'Mexican Green Wave', price: 379, description: 'Crunchy onion, capsicum, tomato, and jalapeños with herbs.' }
  ],
  'Burger': [
    { name: 'Classic Veg Burger', price: 129, description: 'Crispy veg patty with fresh lettuce, onion, and mayo.' },
    { name: 'Maharaja Veg Burger', price: 189, description: 'Double patty burger with extra cheese and premium toppings.' },
    { name: 'Spicy Paneer Burger', price: 159, description: 'Marinated paneer patty with spicy schezwan sauce.' },
    { name: 'Aloo Tikki Burger', price: 99, description: 'Traditional aloo tikki with sweet and sour chutney.' },
    { name: 'Cheese Lava Burger', price: 179, description: 'Burger with a center-filled cheese patty that melts in mouth.' },
    { name: 'BBQ Mushroom Burger', price: 169, description: 'Grilled mushrooms with smoky BBQ sauce and cheese.' }
  ],
  'Indian': [
    { name: 'Dal Makhani', price: 260, description: 'Black lentils slow cooked overnight with butter and cream.' },
    { name: 'Paneer Butter Masala', price: 320, description: 'Cottage cheese cubes in a rich and creamy tomato gravy.' },
    { name: 'Butter Chicken', price: 380, description: 'Tender chicken pieces in a mild and velvety tomato sauce.' },
    { name: 'Mix Veg Jaipuri', price: 240, description: 'Assorted vegetables cooked in a spicy Rajasthani style.' },
    { name: 'Malai Kofta', price: 300, description: 'Deep fried potato and paneer balls in a nutty gravy.' },
    { name: 'Garlic Naan', price: 60, description: 'Soft leavened bread with roasted garlic and butter.' }
  ],
  'Chinese': [
    { name: 'Veg Manchurian', price: 180, description: 'Vegetable balls in a savory, spicy, and tangy sauce.' },
    { name: 'Hakka Noodles', price: 160, description: 'Stir-fried noodles with crisp vegetables and soy sauce.' },
    { name: 'Fried Rice Special', price: 170, description: 'Classic fried rice with assorted veggies and aromatic spices.' },
    { name: 'Chilli Paneer Dry', price: 240, description: 'Cubes of cottage cheese tossed with peppers and green chillies.' },
    { name: 'Spring Rolls', price: 140, description: 'Crispy rolls filled with seasoned vegetable juliennes.' },
    { name: 'Honey Chilli Potato', price: 190, description: 'Crispy fried potatoes tossed in honey and chilli sauce.' }
  ]
};

const RESTAURANTS = [
  { name: 'Biryani Paradise', category: 'Biryani', description: 'Authentic Hyderabadi Biryani and Mughlai specialties.', address: 'Hitech City, Hyderabad', isTrending: true },
  { name: 'Pizza Hub', category: 'Pizza', description: 'The best New York style pizzas in town.', address: 'Jubilee Hills, Hyderabad', isTrending: true },
  { name: 'Burger Kinga', category: 'Burger', description: 'Flame-grilled burgers and crispy fries.', address: 'Madhapur, Hyderabad', isTrending: false },
  { name: 'The Great Indian Thali', category: 'Indian', description: 'Traditional Indian meals served with love.', address: 'Banjara Hills, Hyderabad', isTrending: true },
  { name: 'Dragon Express', category: 'Chinese', description: 'Fast and flavorful Indo-Chinese cuisine.', address: 'Gachibowli, Hyderabad', isTrending: false }
];

const seedApp = async () => {
  try {
    await connectDB();

    // 1. Create/Find Admin User
    let admin = await User.findOne({ email: 'admin@foodhub.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin',
        email: 'admin@foodhub.com',
        password: 'Admin1234!',
        role: 'admin'
      });
      console.log('Admin user created.');
    }

    // 2. Clear Existing Data
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('Cleared existing restaurants and menu items.');

    // 3. Seed Restaurants
    for (const resData of RESTAURANTS) {
      resData.owner = admin._id;
      const restaurant = await Restaurant.create(resData);
      console.log(`Seeded Restaurant: ${restaurant.name}`);

      // 4. Seed Menu Items for this Restaurant
      let menuItems = SAMPLE_MENU_DATA[restaurant.category] || SAMPLE_MENU_DATA['Indian'];
      const itemsToInsert = menuItems.map(item => ({
        ...item,
        category: restaurant.category,
        image: CATEGORY_IMAGES[restaurant.category] || CATEGORY_IMAGES['Indian'],
        restaurantId: restaurant._id
      }));

      await MenuItem.insertMany(itemsToInsert);
      console.log(`  - Seeded ${itemsToInsert.length} menu items.`);
    }

    console.log('✅ Full App Seeding Completed Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedApp();
