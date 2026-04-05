const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// GET /api/users/profile  (protected)
router.get('/profile', authMiddleware, getProfile);

module.exports = router;