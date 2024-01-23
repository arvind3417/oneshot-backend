import multer from 'multer';
import path from "path";

// Set storage engine
const storage = multer.diskStorage({

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
// Initialize upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB file size limit
  },
});

export const uploadMiddleware = upload.single('file');
