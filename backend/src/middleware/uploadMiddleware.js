/**
 * =====================================================
 * EXPERIMENT 11: Backend and Database Connectivity
 * File: backend/src/middleware/uploadMiddleware.js
 * Purpose: Backend module
 * Concepts: API, Database
 * =====================================================
 */
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function(req, file, cb) { cb(null, 'src/uploads/'); },
  filename: function(req, file, cb) { cb(null, `${Date.now()}-${file.originalname}`); }
});
const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) { return cb(null, true); } else { cb(new Error('Images only!')); }
};
const upload = multer({ storage, fileFilter: function(req, file, cb) { checkFileType(file, cb); }, limits: { fileSize: 5 * 1024 * 1024 } });
module.exports = upload;
