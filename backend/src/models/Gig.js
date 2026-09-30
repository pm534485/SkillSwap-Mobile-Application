/**
 * =====================================================
 * EXPERIMENT 11: Backend and Database Connectivity
 * File: backend/src/models/Gig.js
 * Purpose: Backend module
 * Concepts: API, Database
 * =====================================================
 */
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
