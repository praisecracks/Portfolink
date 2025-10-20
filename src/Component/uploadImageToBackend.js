export const uploadImageToBackend = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('https://portfolink-backend.onrender.com/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      // Check if it's an HTML error page
      const text = await response.text();
      console.error('Upload failed (non-JSON response):', text);
      toast.error('Server error during image upload');
      return '';
    }

    const data = await response.json();

    if (data?.imageUrl) {
      return data.imageUrl;
    } else {
      console.error('Image upload failed. No URL returned.');
      return '';
    }

  } catch (err) {
    console.error('Upload error:', err);
    return '';
  }
};
