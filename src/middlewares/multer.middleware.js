import multer from "multer";
import path from "path";

// Store file in memory
const storage = multer.memoryStorage();

// File type validation helper
const checkFileType = (file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const isValidExt = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isValidMime = allowedTypes.test(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, gif) are allowed"));
  }
};

// Multer instance
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

// Single file upload middleware
export const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  };
};

// Multiple file upload middleware
export const uploadMultiple = (fieldName, maxCount = 10) => {
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  };
};

// Optional: field-based upload (for multiple named fields)
export const uploadFields = (fieldsArray) => {
  return (req, res, next) => {
    upload.fields(fieldsArray)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  };
};

export default upload;
