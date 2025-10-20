import React, { useState } from "react";
import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";

export default function JobFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    type: "",
    payType: "",
    skill: "",
  });

  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleReset = () => {
    const cleared = { type: "", payType: "", skill: "" };
    setFilters(cleared);
    onFilter(cleared);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative bg-white/10 dark:bg-white/5 border border-white/20 dark:border-gray-700 rounded-xl p-4 backdrop-blur-md shadow-md"
    >
      {/* Toggle for mobile view */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Filter size={18} /> Filters
        </h3>
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-500 dark:text-gray-400 sm:hidden"
        >
          {open ? <X size={18} /> : <Filter size={18} />}
        </button>
      </div>

      <div
        className={`grid sm:grid-cols-3 gap-3 transition-all duration-300 ${
          open ? "block" : "hidden sm:grid"
        }`}
      >
        {/* Job Type */}
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            Job Type
          </label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full bg-white/10 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-white/20 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All</option>
            <option value="remote">Remote</option>
            <option value="onsite">Onsite</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Pay Type */}
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            Pay Type
          </label>
          <select
            name="payType"
            value={filters.payType}
            onChange={handleChange}
            className="w-full bg-white/10 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-white/20 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All</option>
            <option value="fixed">Fixed</option>
            <option value="hourly">Hourly</option>
          </select>
        </div>

        {/* Skill Search */}
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            Skill
          </label>
          <input
            type="text"
            name="skill"
            value={filters.skill}
            onChange={handleChange}
            placeholder="e.g. React"
            className="w-full bg-white/10 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-white/20 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={handleReset}
          className="text-sm text-indigo-500 hover:underline font-medium"
        >
          Reset Filters
        </button>
      </div>
    </motion.div>
  );
}
