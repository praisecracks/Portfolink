// src/Component/Marketplace/pages/JobDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Briefcase, DollarSign } from "lucide-react";
import ApplyForm from '../components/ApplyForm';

export default function JobDetails() {
  const { id } = useParams(); // Get job ID from URL
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const docRef = doc(db, "jobs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setJob({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-400 dark:text-gray-500">
        Loading job details…
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20 text-gray-400 dark:text-gray-500">
        Job not found.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-2xl shadow-md backdrop-blur-md"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300 hover:text-indigo-500 mb-6"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Job Title + Type */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {job.title}
        </h1>
        <span className="mt-2 sm:mt-0 text-xs px-3 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded-full capitalize">
          {job.type}
        </span>
      </div>

      {/* Company & Duration */}
      <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <Briefcase size={16} /> {job.company}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} /> {job.duration}
        </div>
      </div>

      {/* Job Description */}
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
        {job.description}
      </p>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Required Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {job.skills?.map((skill, i) => (
            <span
              key={i}
              className="text-xs bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Budget Info */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-6">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-lg font-semibold">
          <DollarSign size={18} />
          {job.payType === "fixed"
            ? `$${job.budget}`
            : `${job.budget}/hr`}
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Posted by: {job.postedBy}
        </span>
      </div>

      {/* Apply Form */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-white/5 rounded">
        <h3 className="text-lg font-semibold mb-2">Apply for this job</h3>
        <ApplyForm jobId={job.id} />
      </div>
    </motion.div>
  );
}
