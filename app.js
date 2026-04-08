require('dotenv').config();   

const express = require('express');
const mongoose = require('mongoose');

const app = express();

console.log('Hello World');
console.log("MONGO_URI:", process.env.MONGO_URI);
main()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));