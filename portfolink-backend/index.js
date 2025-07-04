const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
require('dotenv').config(); // Load .env variables

const app = express();
app.use(cors({
  origin: '*',
}));
app.use(express.json());

// Multer setup for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Health check
app.get('/', (req, res) => {
  res.send('✅ Cloudinary Upload + AI API Working');
});

// ✅ Upload Image to Cloudinary
app.post('/upload', upload.single('image'), (req, res) => {
  const stream = cloudinary.uploader.upload_stream(
    { resource_type: 'auto' },
    (error, result) => {
      if (error) {
        console.error('Cloudinary error:', error);
        return res.status(500).json({ error: 'Upload failed', details: error.message });
      }
      return res.json({ imageUrl: result.secure_url });
    }
  );
  stream.end(req.file.buffer);
});

// ✅ Link AI route
const aiRoute = require('./routes/ai'); // This is the file above
app.use('/ai', aiRoute);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
