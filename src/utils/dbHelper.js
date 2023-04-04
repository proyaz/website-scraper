const mongoose = require('mongoose');
const config = require('./config');

const connectToDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
  }
};

module.exports = connectToDB;
