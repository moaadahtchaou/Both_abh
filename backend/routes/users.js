const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../protected');

// @route   GET /api/users/chefs
// @desc    Get all users with role 'Chef'
// @access  Private
router.get('/chefs', authMiddleware, async (req, res) => {
    try {
        const chefs = await User.find({ role: 'Chef' }) // Changed from 'chef' to 'Chef'
            .select('name email')
            .sort({ name: 1 });
        
        console.log('Found chefs:', chefs); // Debug log
        res.json(chefs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 