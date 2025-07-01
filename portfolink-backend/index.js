const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');

const app = express();
app.use(cors());
app.use(express.json());

// Use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary config
cloudinary.config({
  cloud_name: 'dcc1upymc',
  api_key: '446286381522563',
  api_secret: 'l83BgLvXFfv3uwOAtY6zKnvyfuk'
});

// Upload route
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

// Health check route
app.get('/', (req, res) => {
  res.send('✅ Cloudinary Upload API Working');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
