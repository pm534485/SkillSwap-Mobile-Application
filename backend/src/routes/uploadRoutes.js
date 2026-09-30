/**
 * =====================================================
 * EXPERIMENT 11: Backend and Database Connectivity
 * File: backend/src/routes/uploadRoutes.js
 * Purpose: Backend module
 * Concepts: API, Database
 * =====================================================
 */
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadImage } = require('../controllers/uploadController');
router.post('/', upload.single('image'), uploadImage);
module.exports = router;
