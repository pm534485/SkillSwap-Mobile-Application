/**
 * =====================================================
 * EXPERIMENT 11: Backend and Database Connectivity
 * File: backend/src/controllers/authController.js
 * Purpose: Backend module
 * Concepts: API, Database
 * =====================================================
 */
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
