require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const User = require('./backend/models/user');
  
  // Delete existing admin if any
  await User.deleteOne({ email: 'admin@foodhub.com' });
  
  // Let the pre-save hook hash the password naturally
  const admin = new User({
    name: 'Admin',
    email: 'admin@foodhub.com',
    password: 'Admin1234!',
    role: 'admin'
  });
  await admin.save();
  
  console.log('✅ Admin created:', admin.email, '| role:', admin.role);
  await mongoose.disconnect();
}

createAdmin().catch(e => { console.error(e); process.exit(1); });
