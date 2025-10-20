// src/Component/Marketplace/components/JobCard.jsx
import React, { memo } from "react";
import { motion } from "framer-motion";
import { Briefcase, Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 250 }}
      className="bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700/60 backdrop-blur-md rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-400/70 dark:hover:border-indigo-500/60 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {job.title}
        </h3>
        <span className="text-xs px-3 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded-full capitalize">
          {job.type || "Remote"}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {job.description || "No description provided."}
      </p>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
        <div className="flex items-center gap-1">
          <Briefcase size={14} />
          <span>{job.company || "Unknown Company"}</span>
        </div>
        {job.duration && (
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{job.duration}</span>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills?.slice(0, 4).map((skill, i) => (
          <span
            key={i}
            className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-gray-700 dark:text-gray-200"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400">
          <DollarSign size={16} className="mr-1" />
          {job.payType === "fixed"
            ? `$${job.budget}`
            : `$${job.budget}/hr`}
        </div>

        <button
          onClick={() => navigate(`/marketplace/job/${job.id}`)}
          className="px-4 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium transition-all"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
};

export default memo(JobCard);
