/**
 * =====================================================
 * EXPERIMENT 11: Backend and Database Connectivity
 * File: backend/src/controllers/uploadController.js
 * Purpose: Backend module
 * Concepts: API, Database
 * =====================================================
 */
exports.uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({ success: true, data: `/uploads/${req.file.filename}` });
};
