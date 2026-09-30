/**
 * =====================================================
 * EXPERIMENT 11: Backend and Database Connectivity
 * File: backend/src/models/User.js
 * Purpose: Backend module
 * Concepts: API, Database
 * =====================================================
 */
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
