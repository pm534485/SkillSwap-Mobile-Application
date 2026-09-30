/**
 * =====================================================
 * EXPERIMENT 11: Backend and Database Connectivity
 * File: backend/src/routes/authRoutes.js
 * Purpose: Backend module
 * Concepts: API, Database
 * =====================================================
 */
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
module.exports = router;
