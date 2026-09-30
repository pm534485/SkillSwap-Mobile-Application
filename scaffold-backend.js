const fs = require('fs');
const path = require('path');

const backendDir = path.join(__dirname, 'backend');
const srcDir = path.join(backendDir, 'src');

const dirs = [
  'seed',
  'src/config',
  'src/models',
  'src/controllers',
  'src/routes',
  'src/middleware',
  'src/uploads'
];

dirs.forEach(d => {
  const dirPath = path.join(backendDir, d);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// .env.example
fs.writeFileSync(path.join(backendDir, '.env.example'), `PORT=5000\nMONGO_URI=mongodb://127.0.0.1:27017/skillswap\nJWT_SECRET=supersecretjwtkey_12345\n`);

// server.js
fs.writeFileSync(path.join(backendDir, 'server.js'), `
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
app.listen(PORT, '0.0.0.0', () => console.log(\`Server running on port \${PORT}\`));
`);

// .gitkeep for uploads
fs.writeFileSync(path.join(srcDir, 'uploads', '.gitkeep'), '');
