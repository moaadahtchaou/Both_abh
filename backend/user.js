const express = require('express');
const User = require('./models/User');
const router = express.Router();

// Middleware to verify the token, we will import it
const { authMiddleware } = require('./protected');

router.put('/user/:id', authMiddleware, async (req, res) => {
    // Check if the user making the request is the same as the user being updated
    if (req.user.id !== req.params.id) {
        return res.status(403).json({ message: 'Forbidden: You can only update your own profile.' });
    }

    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        // Find the user by ID and update their name
        const user = await User.findByIdAndUpdate(req.params.id, { name }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the updated user information (without the password)
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;