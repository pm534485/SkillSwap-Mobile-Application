/**
 * =====================================================
 * EXPERIMENT 11: Backend and Database Connectivity
 * File: backend/src/models/Booking.js
 * Purpose: Backend module
 * Concepts: API, Database
 * =====================================================
 */
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
