import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import axios from 'axios';

function PostManagement() {
  const currentUser = auth.currentUser;
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loadingForm, setLoadingForm] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    async function fetchPosts() {
      setLoadingPosts(true);
      try {
        const q = query(collection(db, 'posts'), where('authorId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        fetchedPosts.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error('Failed to load posts');
      } finally {
        setLoadingPosts(false);
      }
    }

    fetchPosts();
  }, [currentUser]);

  function resetForm() {
    setTitle('');
    setContent('');
    setImageURL('');
    setImageFile(null);
    setEditingPostId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setLoadingForm(true);

    try {
      let finalImageURL = imageURL.trim() || null;

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
          const res = await axios.post('http://localhost:5000/upload', formData);
          finalImageURL = res.data.imageUrl;
        } catch (uploadErr) {
          console.error("Image upload failed:", uploadErr);
          toast.error("Failed to upload image");
        }
      }

      if (editingPostId) {
        const postRef = doc(db, 'posts', editingPostId);
        await updateDoc(postRef, {
          title: title.trim(),
          content: content.trim(),
          imageURL: finalImageURL,
          updatedAt: serverTimestamp(),
        });

        toast.success('Post updated successfully');
        setPosts(prev =>
          prev.map(post =>
            post.id === editingPostId ? { ...post, title, content, imageURL: finalImageURL } : post
          )
        );
      } else {
        const docRef = await addDoc(collection(db, 'posts'), {
          title: title.trim(),
          content: content.trim(),
          imageURL: finalImageURL,
          createdAt: serverTimestamp(),
          authorId: currentUser.uid,
          authorName: currentUser.displayName || null,
        });

        toast.success('Post created successfully');
        setPosts(prev => [{ id: docRef.id, title, content, imageURL: finalImageURL, authorId: currentUser.uid }, ...prev]);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    } finally {
      setLoadingForm(false);
    }
  }

  async function handleDelete(postId) {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await deleteDoc(doc(db, 'posts', postId));
      toast.success('Post deleted');
      setPosts(prev => prev.filter(post => post.id !== postId));
      if (editingPostId === postId) resetForm();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  }

  function startEdit(post) {
    setTitle(post.title);
    setContent(post.content);
    setImageURL(post.imageURL || '');
    setImageFile(null);
    setEditingPostId(post.id);
  }

  function cancelEdit() {
    resetForm();
  }

  return (
    <div className="max-w-4xl mx-auto p-6 rounded">
      <h2 className="text-3xl font-semibold mb-6 text-indigo-700">
        {editingPostId ? 'Edit Post' : 'Create New Post'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 mb-10">
        <div>
          <label htmlFor="title" className="block font-medium mb-1 text-gray-700">Title *</label>
          <input
            id="title"
            type="text"
            placeholder='Post title...'
            className="w-full px-4 py-2 rounded border border-gray-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block font-medium mb-1 text-gray-700">Content *</label>
          <textarea
            id="content"
            rows="6"
            placeholder='Write announcement or blog post here...'
            className="w-full px-4 py-2 rounded border border-gray-300"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="imageUpload" className="block font-medium mb-1 text-gray-700">Upload Image (optional)</label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full px-4 py-2 rounded border border-gray-300"
          />
        </div>

        <div className="flex gap-4 items-center">
          <button
            type="submit"
            disabled={loadingForm}
            className={`py-3 px-6 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition ${loadingForm ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loadingForm ? (editingPostId ? 'Updating...' : 'Posting...') : editingPostId ? 'Update Post' : 'Post Announcement'}
          </button>

          {editingPostId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="py-3 px-6 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="text-2xl font-semibold mb-4 text-indigo-700">Your Posts</h3>

      {loadingPosts ? (
        <p className="text-gray-500">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">No posts found. Create your first announcement above.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map(post => (
            <li key={post.id} className="p-4 bg-blue-900 rounded-md flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold text-gray-100 mb-4">{post.title}</h4>
                <p className="text-sm text-gray-300 line-clamp-2">{post.content}</p>
                <small className="text-xs text-gray-400">
                  {post.createdAt?.toDate
                    ? post.createdAt.toDate().toLocaleString()
                    : 'Just now'}
                </small><br />
                <small className='text-green-500'>status: posted</small>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(post)}
                  className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PostManagement;
