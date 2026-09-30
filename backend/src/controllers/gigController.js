/**
 * =====================================================
 * EXPERIMENT 11: Backend and Database Connectivity
 * File: backend/src/controllers/gigController.js
 * Purpose: Backend module
 * Concepts: API, Database
 * =====================================================
 */
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
