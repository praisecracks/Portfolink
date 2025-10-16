import React, { useState, useEffect } from 'react';
import { db, auth, storage } from '../../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { uploadImageToBackend } from '../../Component/uploadImageToBackend';
import { toast } from 'react-toastify';
import Chat from './Chat';
import { FaImage } from 'react-icons/fa';
import { onAuthStateChanged } from 'firebase/auth';

function PostManagement() {
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingForm, setLoadingForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingPostId, setEditingPostId] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);

  // Track current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => setCurrentUser(user));
    return () => unsubscribe();
  }, []);

  // Toggle: set to true to force using backend (Cloudinary) for uploads
  const USE_BACKEND_UPLOAD = true; // <-- set true while debugging CORS issues

  // Real-time posts sync
  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, 'posts'), where('authorId', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, snapshot => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      fetched.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setPosts(fetched);
    }, err => {
      console.error(err);
      toast.error('Failed to load posts');
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const cancelImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUploadProgress(0);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setImageFile(null);
    setImagePreview(null);
    setEditingPostId(null);
    setUploadProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return toast.error('You must be logged in to post.');
    if (!title.trim() || !content.trim()) return toast.error('Title and content required');

    setLoadingForm(true);
    let finalImageURL = null;

    if (imageFile) {
      // Basic client-side size check (limit to 10MB)
      const MAX_SIZE = 10 * 1024 * 1024;
      if (imageFile.size > MAX_SIZE) {
        toast.error('Image too large. Max size is 10MB.');
        setLoadingForm(false);
        return;
      }
      try {
        const storageRef = ref(storage, `posts/${currentUser.uid}/${Date.now()}-${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        // Race the upload against a timeout so UI doesn't hang forever
        await new Promise((resolve, reject) => {
          const timeoutMs = 30000; // 30s
          const timeout = setTimeout(() => {
            try { uploadTask.cancel && uploadTask.cancel(); } catch (e) {}
            reject(new Error('Upload timeout'));
          }, timeoutMs);

          uploadTask.on(
            'state_changed',
            snapshot => setUploadProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
            err => {
              clearTimeout(timeout);
              reject(err);
            },
            async () => {
              clearTimeout(timeout);
              try {
                finalImageURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve();
              } catch (e) {
                reject(e);
              }
            }
          );
        });
      } catch (err) {
        console.error('Firebase upload failed:', err);
        // Try fallback to backend upload (Cloudinary)
        toast.info('Primary upload failed, trying fallback...');
        try {
          const fallbackUrl = await uploadImageToBackend(imageFile);
          if (fallbackUrl) {
            finalImageURL = fallbackUrl;
          } else {
            throw new Error('Fallback upload did not return a URL');
          }
        } catch (fbErr) {
          console.error('Fallback upload failed:', fbErr);
          toast.error('Image upload failed. Please try again.');
          setLoadingForm(false);
          return;
        }
      }
    }

    try {
      if (editingPostId) {
        const postRef = doc(db, 'posts', editingPostId);
        await updateDoc(postRef, {
          title: title.trim(),
          content: content.trim(),
          imageURL: finalImageURL,
          updatedAt: serverTimestamp(),
        });
        toast.success('Post updated');
      } else {
        await addDoc(collection(db, 'posts'), {
          title: title.trim(),
          content: content.trim(),
          imageURL: finalImageURL,
          createdAt: serverTimestamp(),
          authorId: currentUser.uid,
          authorName: currentUser.displayName || 'Anonymous',
        });
        toast.success('Post created');
      }

      resetForm();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save post');
    } finally {
      setLoadingForm(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteDoc(doc(db, 'posts', postId));
      toast.success('Post deleted');
      if (editingPostId === postId) resetForm();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete post');
    }
  };

  const startEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setImagePreview(post.imageURL || null);
    setImageFile(null);
    setEditingPostId(post.id);
  };

  const cancelEdit = () => resetForm();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Form */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
          {editingPostId ? 'Edit Post' : 'Create New Post'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 transition"
            required
          />
          <textarea
            rows="4"
            placeholder="Write your post..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 transition"
            required
          />
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-indigo-600 hover:text-indigo-800">
              <FaImage /> {imageFile ? 'Change Image' : 'Upload Image'}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            {imagePreview && (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="max-h-32 rounded shadow-md" />
                <button onClick={cancelImage} className="absolute top-1 right-1 bg-red-600 text-white rounded px-2 py-1 hover:bg-red-700">
                  ✕
                </button>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-1 text-sm text-indigo-600">Uploading: {uploadProgress}%</div>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loadingForm} className={`px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition ${loadingForm ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loadingForm ? (editingPostId ? 'Updating...' : 'Posting...') : editingPostId ? 'Update Post' : 'Post'}
            </button>
            {editingPostId && (
              <button type="button" onClick={cancelEdit} className="px-6 py-3 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No posts found. Create your first post above.</p>
        ) : (
          posts.map(post => {
            const isExpanded = expandedPostId === post.id;
            return (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden"
                onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">{post.title}</h3>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); startEdit(post); }} className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Edit</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">Delete</button>
                    </div>
                  </div>

                  <small className="text-gray-500 dark:text-gray-400">{post.createdAt?.toDate?.().toLocaleString() || 'Just now'}</small>

                  {/* Thumbnail / Placeholder */}
                  <div className="mt-3">
                    {post.imageURL ? (
                      <div className="w-full h-40 rounded overflow-hidden shadow-sm">
                        <img src={post.imageURL} alt="Post thumbnail" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-full h-40 rounded border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <div className="text-center">
                          <FaImage className="mx-auto text-2xl mb-2 text-indigo-400" />
                          <div className="text-sm">No image added</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="mt-3 space-y-2 text-gray-800 dark:text-gray-200">
                      <p>{post.content}</p>
                      {post.imageURL && <img src={post.imageURL} alt="Post" className="max-h-48 rounded shadow-md mt-2 w-full object-cover" />}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <Chat />
    </div>
  );
}

export default PostManagement;
