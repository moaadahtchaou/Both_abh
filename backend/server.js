const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcrypt
const User = require('./models/User'); // Import User model
const authRoutes = require('./auth');
const protectedRoutes = require('./protected');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

/**
 * Seeds the database with a default admin user if it doesn't already exist.
 * This function runs on server startup.
 */
const seedAdminUser = async () => {
  try {
    const adminEmail = 'ismaylabhaje@gmail.com';
    const adminPassword = 'ismail123'; // The plain-text password

    // Check if the admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      // If admin doesn't exist, hash the password and create the user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      await User.create({
        email: adminEmail,
        password: hashedPassword,
      });
      console.log('Admin user has been created successfully.');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error('Error during admin user seeding:', error);
  }
};


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    // Call the function to create the admin user after connecting
    seedAdminUser();
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
