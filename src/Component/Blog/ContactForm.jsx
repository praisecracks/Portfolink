import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { setLogLevel } from 'firebase/firestore';
setLogLevel('debug');
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { useToast } from '../UI/ToastContext';
import { motion } from 'framer-motion';

function Contact() {
  const toast = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState(null);

  // 🔍 Fetch admin UID from Firestore
  useEffect(() => {
    const fetchAdminUID = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'Admin'));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          setAdminId(snapshot.docs[0].id); // ✅ Set found admin
        } else {
          // 👇 fallback if no admin found
          const fallbackAdminUID = 'msLzg2LxX7Rd3WKVwaqmhWl9KUk2';
          setAdminId(fallbackAdminUID);
        }
      } catch (err) {
        console.error('Error fetching admin:', err);
      }
    };

    fetchAdminUID();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!adminId) {
      toast.push('Admin not available. Try again later.', { type: 'error' });
      setLoading(false);
      return;
    }

try {
  await addDoc(collection(db, `messages/${adminId}/inbox`), {
    name: formData.name,
    email: formData.email,
    message: formData.message,
    timestamp: serverTimestamp(),
    read: false,
    source: 'Landing Page',
  });

  if (!navigator.onLine) {
    toast.push("You're currently offline. Your message will send when connection is restored.", { type: 'info' });
  }
  toast.push('Message sent successfully!', { type: 'info' });
  setFormData({ name: '', email: '', message: '' });
} catch (err) {
  console.error('Firestore Error:', err);
  toast.push('Failed to send message.', { type: 'error' });
} finally {
  setLoading(false);
}
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Contact Us</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <motion.input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
          whileFocus={{ scale: 1.02 }}
          className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <motion.input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          required
          whileFocus={{ scale: 1.02 }}
          className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <motion.textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="4"
          placeholder="Your Message"
          required
          whileFocus={{ scale: 1.02 }}
          className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />

        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </motion.button>
      </form>
    </motion.div>
  );
}

export default Contact;
