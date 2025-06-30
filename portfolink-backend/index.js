// index.js (Node backend)
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// TEMP FILE STORAGE
const upload = multer({ dest: 'temp/' });

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dcc1upymc',
  api_key: '446286381522563',
  api_secret: 'l83BgLvXFfv3uwOAtY6zKnvyfuk'
});

// Upload endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path); // Clean up temp file
    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

// Health Check
app.get('/', (req, res) => {
  res.send('✅ Cloudinary Upload API Working');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
