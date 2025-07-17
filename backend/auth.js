const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Import the User model
const { authMiddleware } = require('./protected');
const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        console.log("success");
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token }); // Only return the token


    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// Admin-only endpoint to register new chef users
router.post('/register-chef', authMiddleware, async (req, res) => {
    try {
        // Check if the requesting user is an admin
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Access denied. Only admins can register new chefs.' });
        }

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
        }

        // Hash password and create user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with Chef role
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'Chef' // Explicitly set role to Chef
        });

        res.status(201).json({ message: 'Chef enregistré avec succès' });

    } catch (error) {
        console.error('Error registering chef:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});


// Get current user data from token
router.get('/me', authMiddleware, async (req, res) => {
    console.log('GET /me - User ID from token:', req.user.id);
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            console.log('User not found in database');
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('Sending user data:', {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        console.error('Error in /me endpoint:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});



module.exports = router;