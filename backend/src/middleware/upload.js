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
    const allowedExtensions = new Set([
        '.pdf', '.doc', '.docx', '.txt',
        '.jpg', '.jpeg', '.png', '.webp', '.gif', '.jfif', '.avif', '.heic', '.heif'
    ]);
    const documentMimeTypes = new Set([
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ]);
    const imageMimeTypes = new Set([
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/avif',
        'image/heic',
        'image/heif',
        'image/pjpeg'
    ]);
    const documentExtensions = new Set(['.pdf', '.doc', '.docx', '.txt']);
    const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.jfif', '.avif', '.heic', '.heif']);
    const extname = path.extname(file.originalname).toLowerCase();
    const normalizedMimeType = (file.mimetype || '').toLowerCase();
    const extensionAllowed = allowedExtensions.has(extname);
    const isGenericMime = normalizedMimeType === 'application/octet-stream';

    const mimeMatchesExtension = documentExtensions.has(extname)
        ? (documentMimeTypes.has(normalizedMimeType) || isGenericMime)
        : imageExtensions.has(extname)
            ? (imageMimeTypes.has(normalizedMimeType) || isGenericMime)
            : false;

    // Allow known file extensions only when MIME type matches expected category.
    if (extensionAllowed && mimeMatchesExtension) {
        return cb(null, true);
    } else {
        cb(new Error('Only document files (PDF, DOC, DOCX, TXT) and photos (JPG, JPEG, PNG, WEBP, GIF, JFIF, AVIF, HEIC, HEIF) are allowed'));
    }
};

// Initialize multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: fileFilter
});

module.exports = upload;
