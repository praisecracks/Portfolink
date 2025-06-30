import React, { useState } from 'react';

function ImageUploader() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', image);

    const res = await fetch('https://portfolink-backend.onrender.com', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setUploadedUrl(data.imageUrl);
  };

  return (
    <div className="p-4">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="preview" className="w-48 mt-2 rounded" />}
      <button onClick={handleUpload} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">
        Upload to Cloudinary
      </button>
      {uploadedUrl && (
        <div className="mt-4">
          <p className="text-green-700">Uploaded Successfully:</p>
          <a href={uploadedUrl} target="_blank" rel="noreferrer">{uploadedUrl}</a>
          <img src={uploadedUrl} alt="uploaded" className="w-48 mt-2 rounded" />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
