// src/Component/Marketplace/components/JobForm.jsx
import React, { useState } from "react";
import { addDoc, collection, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import isAdmin from '../utils/isAdmin';
import { motion } from "framer-motion";
import { useToast } from '../../UI/ToastContext';
import BillingModal from './BillingModal';

export default function JobForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    company: "",
    type: "",
    payType: "",
    budget: "",
    duration: "",
    skills: "",
  });
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  const isAdminLocal = isAdmin(user);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdminLocal) {
      console.warn('Access denied for user:', user?.uid, user?.email);
      return;
    }
    setLoading(true);
  const toast = useToast();

  try {
      // Debug: read users/{uid} document to confirm server-side role
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);
        console.log('JobForm debug: currentUser', { uid: user.uid, email: user.email, isAdminLocal });
        console.log('JobForm debug: users/{uid} doc exists:', userSnap.exists(), 'data:', userSnap.data());
      } catch (readErr) {
        console.warn('JobForm debug: failed to read users/{uid} doc', readErr);
      }

      await addDoc(collection(db, "jobs"), {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()),
        postedBy: user.uid,
        posterEmail: user.email || null,
        createdAt: serverTimestamp(),
      });
  toast.push('Job posted successfully!', { type: 'info' });
      setForm({
        title: "",
        description: "",
        company: "",
        type: "",
        payType: "",
        budget: "",
        duration: "",
        skills: "",
      });
    } catch (err) {
      console.error("Error adding job:", err);
      const code = err?.code || 'unknown';
      const message = err?.message || String(err);
      toast.push(`Failed to post job. (${code}) ${message}`, { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Paid request flow for non-admins
  const [billingOpen, setBillingOpen] = useState(false);
  const handleRequestPaid = () => {
    setBillingOpen(true);
  };

  const onBillingClose = (paid) => {
    setBillingOpen(false);
    if (paid) {
      // Clear form to indicate submission
      setForm({ title: "", description: "", company: "", type: "", payType: "", budget: "", duration: "", skills: "" });
    }
  };

  if (!isAdminLocal) {
    return (
      <div className="max-w-3xl mx-auto bg-white dark:bg-white/10 backdrop-blur-lg border border-gray-200 dark:border-white/20 rounded-2xl p-8 shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Request a Job Posting</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-4">You don't have permission to publish directly. You can request a posting — a small fee applies and an admin will review and publish it.</p>
        <div className="space-y-4">
          <button onClick={handleRequestPaid} className="px-5 py-3 bg-indigo-600 text-white rounded">Request Paid Posting</button>
        </div>
        <BillingModal open={billingOpen} onClose={onBillingClose} jobPayload={{ ...form, amount: 10 }} user={user} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto bg-white dark:bg-white/10 backdrop-blur-lg border border-gray-200 dark:border-white/20 rounded-2xl p-8 shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Post a New Job
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Job Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            placeholder="e.g. React Developer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            required
            className="mt-1 w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            placeholder="Describe the role and responsibilities..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Company
            </label>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              className="mt-1 w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              placeholder="Company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="mt-1 w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              <option value="">Select</option>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>Onsite</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Payment Type
            </label>
            <select
              name="payType"
              value={form.payType}
              onChange={handleChange}
              className="mt-1 w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              <option value="">Select</option>
              <option>Hourly</option>
              <option>Fixed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Budget
            </label>
            <input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="e.g. 500"
              className="mt-1 w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Duration
          </label>
          <input
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="e.g. 4 weeks"
            className="mt-1 w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Skills (comma-separated)
          </label>
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="e.g. React, Firebase, Tailwind"
            className="mt-1 w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold rounded-lg transition-all"
        >
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </motion.div>
  );
}
