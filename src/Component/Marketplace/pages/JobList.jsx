// src/Component/Marketplace/pages/JobList.jsx
import React, { useEffect, useState, useMemo } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import JobCard from "../components/JobCard";
import JobFilter from "../components/JobFilter";
import { motion } from "framer-motion";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    payType: "",
    skill: "",
  });

  // 🔥 Fetch all jobs from Firestore
  useEffect(() => {
    const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const arr = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setJobs(arr);
        setLoading(false);
      },
      (err) => {
        console.error("jobs onSnapshot error", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // 🎯 Apply filters dynamically
  useEffect(() => {
    let filtered = [...jobs];

    if (filters.type)
      filtered = filtered.filter(
        (job) => job.type?.toLowerCase() === filters.type.toLowerCase()
      );

    if (filters.payType)
      filtered = filtered.filter(
        (job) => job.payType?.toLowerCase() === filters.payType.toLowerCase()
      );

    if (filters.skill)
      filtered = filtered.filter((job) =>
        job.skills?.some((skill) =>
          skill.toLowerCase().includes(filters.skill.toLowerCase())
        )
      );

    setFilteredJobs(filtered);
  }, [filters, jobs]);

  const totalJobs = useMemo(() => filteredJobs.length, [filteredJobs]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Available Jobs
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {totalJobs} listing{totalJobs !== 1 && "s"}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <JobFilter onFilter={setFilters} />
      </div>

      {/* Job Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          Loading jobs…
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          No matching jobs found.
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
