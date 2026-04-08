const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
const connectDB  = require('./server/config/db.js');
const { errorHandler } = require('./server/middleware/errorMiddleware');
const mongoose   = require('mongoose');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',        require('./server/routes/authRoutes'));
app.use('/api/restaurants', require('./server/routes/restaurantRoutes'));
app.use('/api/menu',        require('./server/routes/menuRoutes'));
app.use('/api/orders',      require('./server/routes/orderRoutes'));
app.use('/api/reviews',     require('./server/routes/reviewRoutes'));
app.use('/api/admin',       require('./server/routes/adminRoutes'));

app.get('/', (req, res) => res.send('🍔 Food Ordering API Running'));

app.use(errorHandler);

main()
    .then(() =>{
         console.log('Connected to MongoDB')
        })
    .catch(err =>{ 
        console.error('MongoDB connection error:', err)
     });

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
}
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));