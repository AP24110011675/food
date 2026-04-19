const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const BASE_URL = `http://localhost:${process.env.PORT || 5001}`;

const testAPIs = async () => {
  console.log('--- STARTING API TESTS ---');

  // 1. Test GET /api/restaurants
  try {
    console.log('Testing GET /api/restaurants...');
    const res = await axios.get(`${BASE_URL}/api/restaurants`);
    console.log('Status:', res.status);
    const items = res.data.data || res.data;
    console.log('Data structure:', Array.isArray(items) ? 'Array' : typeof items);
    
    // Check if the specific requested restaurants exist
    const names = items.map(r => r.name);
    if (!names.includes("Hyderabadi Biryani House") || !names.includes("Pizza Hub") || !names.includes("Burger Point")) {
      console.log('!!! Requested sample restaurants missing. Seeding...');
      await seedRestaurants();
    } else {
      console.log('Success: All requested sample restaurants found.');
    }
  } catch (err) {
    console.error('Error testing /api/restaurants:', err.message);
  }

  // 2. Test GET /api/menu (using first restaurant id if available)
  try {
    const restRes = await axios.get(`${BASE_URL}/api/restaurants`);
    const rests = restRes.data.data || restRes.data;
    if (rests.length > 0) {
      const restId = rests[0]._id;
      console.log(`Testing GET /api/menu/${restId}...`);
      const menuRes = await axios.get(`${BASE_URL}/api/menu/${restId}`);
      console.log('Status:', menuRes.status);
      const menuItems = menuRes.data.data || menuRes.data;
      console.log('Menu Items Found:', Array.isArray(menuItems) ? menuItems.length : 'Wrong structure');
    }
  } catch (err) {
    console.error('Error testing /api/menu:', err.message);
  }

  // 3. Test POST /api/auth/register (Sample)
  try {
    const timestamp = Date.now();
    console.log('Testing POST /api/auth/register...');
    const regRes = await axios.post(`${BASE_URL}/api/auth/register`, {
      name: `Test User ${timestamp}`,
      email: `test${timestamp}@test.com`,
      password: 'password123'
    });
    console.log('Status:', regRes.status);
    console.log('User Registered:', regRes.data.success);
  } catch (err) {
    console.error('Error testing /api/auth/register:', err.response ? err.response.data : err.message);
  }

  // 4. Test POST /api/auth/login
  let authToken = '';
  try {
    console.log('Testing POST /api/auth/login...');
    const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@foodhub.com', 
      password: 'password'
    });
    console.log('Status:', loginRes.status);
    authToken = loginRes.data.data.token;
    console.log('Token received:', !!authToken);
  } catch (err) {
    console.error('Error testing /api/auth/login:', err.response ? err.response.data : err.message);
  }

  // 5. Test GET /api/admin/orders (Requires Auth)
  if (authToken) {
    try {
      console.log('Testing GET /api/admin/orders...');
      const adminRes = await axios.get(`${BASE_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('Status:', adminRes.status);
      console.log('Orders Found:', Array.isArray(adminRes.data.data) ? adminRes.data.data.length : 'Wrong structure');
    } catch (err) {
      console.error('Error testing /api/admin/orders:', err.response ? err.response.data : err.message);
    }
  } else {
    console.log('Skipping /api/admin/orders due to no auth token');
  }

  console.log('--- API TESTS COMPLETED ---');
  process.exit(0);
};

const seedRestaurants = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const Restaurant = require('./backend/models/restaurant');
    const User = require('./backend/models/user');

    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@foodhub.com',
        password: 'password',
        role: 'admin'
      });
    }

    const sampleData = [
      {
        name: "Hyderabadi Biryani House",
        category: "Biryani",
        image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
        rating: 4.5,
        isTrending: true,
        description: "Authentic Hyderabadi Biryani",
        address: "Hyderabad",
        owner: adminUser._id
      },
      {
        name: "Pizza Hub",
        category: "Pizza",
        image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65",
        rating: 4.2,
        description: "Cheesy pizzas",
        address: "Downtown",
        owner: adminUser._id
      },
      {
        name: "Burger Point",
        category: "Burger",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
        rating: 4.3,
        description: "Juicy burgers",
        address: "Street 10",
        owner: adminUser._id
      }
    ];

    for (const data of sampleData) {
      const exists = await Restaurant.findOne({ name: data.name });
      if (!exists) {
        await Restaurant.create(data);
        console.log(`Added: ${data.name}`);
      }
    }
    
    console.log('SUCCESS: Sample restaurants updated in DB');
    await mongoose.disconnect();
  } catch (err) {
    console.error('SEEDING ERROR:', err.message);
  }
};

testAPIs();

