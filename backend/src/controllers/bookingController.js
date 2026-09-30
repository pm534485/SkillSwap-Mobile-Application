/**
 * =====================================================
 * EXPERIMENT 11: Backend and Database Connectivity
 * File: backend/src/controllers/bookingController.js
 * Purpose: Backend module
 * Concepts: API, Database
 * =====================================================
 */
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
