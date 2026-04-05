const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for uploading only specific file types
const fileFilter = (req, file, cb) => {
    const allowedExtensions = new Set(['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.webp']);
    const allowedMimeTypes = new Set([
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'application/octet-stream'
    ]);
    const extname = path.extname(file.originalname).toLowerCase();
    const extensionAllowed = allowedExtensions.has(extname);
    const mimeAllowed = allowedMimeTypes.has((file.mimetype || '').toLowerCase());

    // Accept known safe file extensions even when MIME type is generic/octet-stream.
    if (extensionAllowed && (mimeAllowed || (file.mimetype || '').toLowerCase() === 'application/octet-stream')) {
        return cb(null, true);
    } else {
        cb(new Error('Only document files (PDF, DOC, DOCX, TXT) and photos (JPG, JPEG, PNG, WEBP) are allowed'));
    }
};

// Initialize multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: fileFilter
});

module.exports = upload;
