export const uploadImageToBackend = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('https://portfolink-backend.onrender.com/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    return data.imageUrl;
  } catch (err) {
    console.error('Upload error:', err);
    toast.error('Image upload failed');
    return '';
  }
};
