
/**
 * =====================================================
 * EXPERIMENT 11: Backend and Database Connectivity
 * File: server.js
 * Purpose: Express entry point
 * Concepts: Express, Middleware, Routing, CORS
 * =====================================================
 */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./src/config/Exp11_db');
const { errorHandler } = require('./src/middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/gigs', require('./src/routes/gigRoutes'));
app.use('/api/bookings', require('./src/routes/bookingRoutes'));
app.use('/api/upload', require('./src/routes/uploadRoutes'));

// Health check
app.get('/api/health', (req, res) => res.json({ success: true, message: 'Server is running' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
