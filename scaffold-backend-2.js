const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'backend', 'src');

const files = {
  'config/Exp11_db.js': `
const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(\`MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error(\`Error: \${error.message}\`);
    process.exit(1);
  }
};
module.exports = connectDB;
`,
  'models/User.js': `
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  skillsOffered: [String],
  avatarUrl: String,
  rating: { type: Number, default: 0 },
}, { timestamps: true });

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

module.exports = mongoose.model('User', userSchema);
`,
  'models/Gig.js': `
const mongoose = require('mongoose');
const gigSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  durationMinutes: { type: Number, required: true },
  location: { type: String, required: true },
  availability: { type: String, required: true },
  thumbnailUrl: String,
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  ratingAvg: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  status: { type: String, default: 'active' }
}, { timestamps: true });
gigSchema.index({ title: 'text', description: 'text' });
gigSchema.index({ category: 1, price: 1 });
module.exports = mongoose.model('Gig', gigSchema);
`,
  'models/Booking.js': `
const mongoose = require('mongoose');
const bookingSchema = mongoose.Schema({
  gig: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Gig' },
  buyer: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  seller: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  scheduledFor: { type: Date },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  notes: String
}, { timestamps: true });
module.exports = mongoose.model('Booking', bookingSchema);
`,
  'middleware/errorMiddleware.js': `
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
module.exports = { errorHandler };
`,
  'middleware/authMiddleware.js': `
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-passwordHash');
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};
module.exports = { protect };
`,
  'middleware/uploadMiddleware.js': `
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function(req, file, cb) { cb(null, 'src/uploads/'); },
  filename: function(req, file, cb) { cb(null, \`\${Date.now()}-\${file.originalname}\`); }
});
const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) { return cb(null, true); } else { cb(new Error('Images only!')); }
};
const upload = multer({ storage, fileFilter: function(req, file, cb) { checkFileType(file, cb); }, limits: { fileSize: 5 * 1024 * 1024 } });
module.exports = upload;
`,
  'controllers/authController.js': `
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, skillsOffered } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });
    const user = await User.create({ name, email, passwordHash: password, skillsOffered: skillsOffered || [] });
    if (user) {
      res.status(201).json({ success: true, data: { _id: user._id, name: user.name, email: user.email, skillsOffered: user.skillsOffered, token: generateToken(user._id) } });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) { next(error); }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({ success: true, data: { _id: user._id, name: user.name, email: user.email, skillsOffered: user.skillsOffered, token: generateToken(user._id) } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) { next(error); }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
};
`,
  'controllers/gigController.js': `
const Gig = require('../models/Gig');
exports.getGigs = async (req, res, next) => {
  try {
    const { q, category, sort, page = 1, limit = 10 } = req.query;
    let query = {};
    if (q) query.$text = { $search: q };
    if (category) query.category = category;
    
    let sortObj = { createdAt: -1 };
    if (sort === 'priceAsc') sortObj = { price: 1 };
    if (sort === 'priceDesc') sortObj = { price: -1 };

    const gigs = await Gig.find(query).populate('owner', 'name avatarUrl rating').sort(sortObj).limit(limit * 1).skip((page - 1) * limit);
    res.json({ success: true, data: gigs });
  } catch (error) { next(error); }
};
exports.getGigById = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('owner', 'name avatarUrl rating skillsOffered');
    if (gig) { res.json({ success: true, data: gig }); } else { res.status(404).json({ success: false, message: 'Gig not found' }); }
  } catch (error) { next(error); }
};
exports.createGig = async (req, res, next) => {
  try {
    const gig = new Gig({ ...req.body, owner: req.user._id });
    const createdGig = await gig.save();
    res.status(201).json({ success: true, data: createdGig });
  } catch (error) { next(error); }
};
exports.updateGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
    if (gig.owner.toString() !== req.user._id.toString()) return res.status(401).json({ success: false, message: 'Not authorized' });
    const updatedGig = await Gig.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updatedGig });
  } catch (error) { next(error); }
};
exports.deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
    if (gig.owner.toString() !== req.user._id.toString()) return res.status(401).json({ success: false, message: 'Not authorized' });
    await gig.deleteOne();
    res.json({ success: true, message: 'Gig removed' });
  } catch (error) { next(error); }
};
`,
  'controllers/bookingController.js': `
const Booking = require('../models/Booking');
const Gig = require('../models/Gig');
exports.createBooking = async (req, res, next) => {
  try {
    const { gig: gigId, scheduledFor, notes } = req.body;
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
    const booking = new Booking({ gig: gigId, buyer: req.user._id, seller: gig.owner, scheduledFor, notes });
    const createdBooking = await booking.save();
    res.status(201).json({ success: true, data: createdBooking });
  } catch (error) { next(error); }
};
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ $or: [{ buyer: req.user._id }, { seller: req.user._id }] }).populate('gig', 'title price thumbnailUrl').populate('buyer', 'name').populate('seller', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) { next(error); }
};
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.buyer.toString() !== req.user._id.toString() && booking.seller.toString() !== req.user._id.toString()) return res.status(401).json({ success: false, message: 'Not authorized' });
    booking.status = 'cancelled';
    await booking.save();
    res.json({ success: true, data: booking });
  } catch (error) { next(error); }
};
`,
  'controllers/uploadController.js': `
exports.uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({ success: true, data: \`/uploads/\${req.file.filename}\` });
};
`,
  'routes/authRoutes.js': `
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
module.exports = router;
`,
  'routes/gigRoutes.js': `
const express = require('express');
const router = express.Router();
const { getGigs, getGigById, createGig, updateGig, deleteGig } = require('../controllers/gigController');
const { protect } = require('../middleware/authMiddleware');
router.route('/').get(getGigs).post(protect, createGig);
router.route('/:id').get(getGigById).put(protect, updateGig).delete(protect, deleteGig);
module.exports = router;
`,
  'routes/bookingRoutes.js': `
const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
router.route('/').post(protect, createBooking);
router.get('/mine', protect, getMyBookings);
router.patch('/:id/cancel', protect, cancelBooking);
module.exports = router;
`,
  'routes/uploadRoutes.js': `
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadImage } = require('../controllers/uploadController');
router.post('/', upload.single('image'), uploadImage);
module.exports = router;
`
};

Object.entries(files).forEach(([file, content]) => {
  const fullPath = path.join(srcDir, file);
  fs.writeFileSync(fullPath, \`
/**
 * =====================================================
 * EXPERIMENT 11: Backend and Database Connectivity
 * File: backend/src/\${file}
 * Purpose: Backend module
 * Concepts: API, Database
 * =====================================================
 */
\${content.trim()}
\`);
});
