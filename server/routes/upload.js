const express = require('express');
const router = express.Router();
const upload = require('../utils/uploadConfig');

// @route   POST api/upload
// @desc    Upload an image file
// @access  Public (or Protected if needed)
router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }
        // Return the static path to the file
        // Assumes 'public' folder is served statically
        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({ url: fileUrl });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error during upload');
    }
});

module.exports = router;
