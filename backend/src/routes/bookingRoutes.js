/**
 * =====================================================
 * EXPERIMENT 11: Backend and Database Connectivity
 * File: backend/src/routes/bookingRoutes.js
 * Purpose: Backend module
 * Concepts: API, Database
 * =====================================================
 */
const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
router.route('/').post(protect, createBooking);
router.get('/mine', protect, getMyBookings);
router.patch('/:id/cancel', protect, cancelBooking);
module.exports = router;
