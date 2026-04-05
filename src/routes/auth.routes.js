const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const { registerSchema, loginSchema, validate } = require('../validators/auth.validator');

// POST /api/auth/register
router.post('/register', validate(registerSchema), register);

// POST /api/auth/login
router.post('/login', validate(loginSchema), login);

module.exports = router;