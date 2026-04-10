const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
const connectDB  = require('./backend/config/db.js');
const { errorHandler, notFound } = require('./backend/middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth',        require('./backend/routes/authRoutes'));
app.use('/api/restaurants', require('./backend/routes/restaurantRoutes'));
app.use('/api/menu',        require('./backend/routes/menuRoutes'));
app.use('/api/orders',      require('./backend/routes/orderRoutes'));
app.use('/api/reviews',     require('./backend/routes/reviewRoutes'));
app.use('/api/admin',       require('./backend/routes/adminRoutes'));

app.get('/', (req, res) => res.send('🍔 FoodHub API is performing optimally'));

// Error Handling Infrastructure
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));