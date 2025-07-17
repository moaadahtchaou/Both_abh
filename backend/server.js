const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const authRoutes = require('./auth');
const { router: protectedRoutes } = require('./protected');
const userRoutes = require('./routes/users'); // Updated path
const chantierRoutes = require('./chantier');
const materielRoutes = require('./materiel');
const reportRoutes = require('./routes/reports');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI) // Changed from MONGODB_URI to MONGO_URI
    .then(async () => {
        console.log('Connected to MongoDB');
        
        // Create default admin user if it doesn't exist
        try {
            const adminEmail = 'ismaylabhaje@gmail.com';
            const existingAdmin = await User.findOne({ email: adminEmail });
            
            if (!existingAdmin) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('ismail123', salt);
                
                await User.create({
                    name: 'Ismail Rwawi',
                    email: adminEmail,
                    password: hashedPassword,
                    role: 'Admin'
                });
                
                console.log('Default admin user created successfully');
            }
            else{
                console.log('Default admin user already exists');
            }
        } catch (error) {
            console.error('Error creating default admin user:', error);
        }
    })
    .catch(err => console.error('MongoDB connection error:', err));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // Updated route path
app.use('/api', chantierRoutes);
app.use('/api', materielRoutes);
app.use('/api/reports', reportRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
