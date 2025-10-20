// src/Component/Marketplace/pages/PostJob.jsx
import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { useToast } from '../../UI/ToastContext';
import isAdmin from '../utils/isAdmin';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function PostJob() {
  const toast = useToast();
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
  const navigate = useNavigate();

  const user = auth.currentUser;
  const isAdminUser = isAdmin(user);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdminUser) {
      console.warn('Access denied for user:', user?.uid, user?.email);
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "jobs"), {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()),
        postedBy: user.uid,
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
      navigate("/dashboard/marketplace/my-jobs"); // go to My Jobs
    } catch (err) {
      console.error("Error adding job:", err);
      toast.push('Failed to post job.', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-300 mt-20">
        Please log in to post jobs.
      </div>
    );
  }

  if (!isAdminUser) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-300 mt-20">
        You do not have permission to post jobs. Only admins can post.
        <div className="mt-3 text-xs text-gray-400">If you believe this is an error, check your account or contact support.</div>
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
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="text-sm text-indigo-600 hover:underline">← Back</button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Post a New Job</h2>
        <div />
      </div>

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
              placeholder="Company name"
              className="mt-1 w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
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
