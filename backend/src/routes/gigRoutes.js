/**
 * =====================================================
 * EXPERIMENT 11: Backend and Database Connectivity
 * File: backend/src/routes/gigRoutes.js
 * Purpose: Backend module
 * Concepts: API, Database
 * =====================================================
 */
const express = require('express');
const router = express.Router();
const { getGigs, getGigById, createGig, updateGig, deleteGig } = require('../controllers/gigController');
const { protect } = require('../middleware/authMiddleware');
router.route('/').get(getGigs).post(protect, createGig);
router.route('/:id').get(getGigById).put(protect, updateGig).delete(protect, deleteGig);
module.exports = router;
