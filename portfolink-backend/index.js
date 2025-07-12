const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();

const app = express();
app.use(cors());
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

// ✅ Upload Image to Cloudinary (with safety check)
app.post('/upload', upload.single('image'), (req, res) => {
  // Check if file is missing
  if (!req.file) {
    return res.status(400).json({ error: 'No image file received' });
  }

  // Proceed with upload
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

// ✅ AI (Cohere) Project Description Generator
const aiRoute = require('./routes/ai');
app.use('/ai', aiRoute);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
